import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../config/database';
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  TooManyRequestsError,
} from '../utils/errors';
import { logger } from '../utils/logger';

/**
 * Get active stories (not expired)
 */
export const getStories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const cityId = authReq.user?.cityId;

    const now = new Date();

    // Get stories that haven't expired (expiresAt > now)
    const stories = await prisma.story.findMany({
      where: {
        cityId,
        expiresAt: {
          gt: now,
        },
      },
      select: {
        id: true,
        type: true,
        title: true,
        image: true,
        link: true,
        viewCount: true,
        clickCount: true,
        expiresAt: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        business: {
          select: {
            id: true,
            slug: true,
            name: true,
            logo: true,
            verified: true,
            subscriptionPlan: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            priceType: true,
            price: true,
            images: true,
          },
        },
      },
      orderBy: [
        { business: { subscriptionPlan: 'desc' } }, // PARTNER stories first (priority)
        { createdAt: 'desc' }, // Most recent
      ],
    });

    res.json({
      success: true,
      data: stories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single story by ID
 */
export const getStoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const story = await prisma.story.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            phone: true,
            whatsapp: true,
          },
        },
        business: {
          select: {
            id: true,
            slug: true,
            name: true,
            logo: true,
            verified: true,
            subscriptionPlan: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            images: true,
            category: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            priceType: true,
            price: true,
            images: true,
            category: true,
          },
        },
        city: {
          select: {
            id: true,
            name: true,
            state: true,
          },
        },
      },
    });

    if (!story) {
      throw new NotFoundError('Story not found');
    }

    // Check if expired
    if (story.expiresAt < new Date()) {
      throw new NotFoundError('Story has expired');
    }

    // Increment view count (async, don't wait)
    prisma.story
      .update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      })
      .catch((err) => logger.error('Failed to increment story view count', err));

    res.json({
      success: true,
      data: story,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create story
 */
export const createStory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;

    const { type, title, image, link, productId, serviceId } = req.body;

    if (!type || !image) {
      throw new BadRequestError('Type and image are required');
    }

    // Check daily story limit (5 per day)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayStoriesCount = await prisma.story.count({
      where: {
        userId,
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    if (todayStoriesCount >= 5) {
      throw new TooManyRequestsError(
        'Daily story limit reached (5 stories per day)'
      );
    }

    // Get user's business if they have one
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        cityId: true,
        business: {
          select: {
            id: true,
          },
        },
      },
    });

    // Calculate expiration time (23:59:59 of today)
    const expiresAt = new Date();
    expiresAt.setHours(23, 59, 59, 999);

    const story = await prisma.story.create({
      data: {
        userId,
        businessId: user?.business?.id,
        cityId: user!.cityId,
        type,
        title,
        image,
        link,
        productId,
        serviceId,
        expiresAt,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        business: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    logger.info(`Story created: ${story.id} by user ${userId}`);

    res.status(201).json({
      success: true,
      message: 'Story created successfully',
      data: story,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete story
 */
export const deleteStory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;
    const { id } = req.params;

    // Check if story exists and belongs to user
    const story = await prisma.story.findUnique({
      where: { id },
    });

    if (!story) {
      throw new NotFoundError('Story not found');
    }

    if (story.userId !== userId) {
      throw new ForbiddenError('You can only delete your own stories');
    }

    // Hard delete story
    await prisma.story.delete({
      where: { id },
    });

    logger.info(`Story deleted: ${id}`);

    res.json({
      success: true,
      message: 'Story deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Increment story click count
 */
export const incrementStoryClick = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const story = await prisma.story.findUnique({
      where: { id },
      select: {
        id: true,
        expiresAt: true,
      },
    });

    if (!story) {
      throw new NotFoundError('Story not found');
    }

    // Check if expired
    if (story.expiresAt < new Date()) {
      throw new NotFoundError('Story has expired');
    }

    // Increment click count
    await prisma.story.update({
      where: { id },
      data: { clickCount: { increment: 1 } },
    });

    res.json({
      success: true,
      message: 'Click counted',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get my stories
 */
export const getMyStories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;

    const { includeExpired = 'false' } = req.query;

    const where: any = { userId };

    // By default, only show non-expired stories
    if (includeExpired !== 'true') {
      where.expiresAt = {
        gt: new Date(),
      };
    }

    const stories = await prisma.story.findMany({
      where,
      select: {
        id: true,
        type: true,
        title: true,
        image: true,
        link: true,
        viewCount: true,
        clickCount: true,
        expiresAt: true,
        createdAt: true,
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: stories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get story statistics
 */
export const getStoryStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;
    const { id } = req.params;

    const story = await prisma.story.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        type: true,
        title: true,
        viewCount: true,
        clickCount: true,
        createdAt: true,
        expiresAt: true,
      },
    });

    if (!story) {
      throw new NotFoundError('Story not found');
    }

    if (story.userId !== userId) {
      throw new ForbiddenError('You can only view stats for your own stories');
    }

    // Calculate CTR (Click-Through Rate)
    const ctr = story.viewCount > 0 ? (story.clickCount / story.viewCount) * 100 : 0;

    res.json({
      success: true,
      data: {
        id: story.id,
        type: story.type,
        title: story.title,
        views: story.viewCount,
        clicks: story.clickCount,
        ctr: parseFloat(ctr.toFixed(2)),
        createdAt: story.createdAt,
        expiresAt: story.expiresAt,
        isExpired: story.expiresAt < new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};
