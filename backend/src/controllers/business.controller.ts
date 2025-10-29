import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../config/database';
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from '../utils/errors';
import { generateSlug } from '../utils/slug.util';
import { logger } from '../utils/logger';

/**
 * Get all businesses (with filtering and pagination)
 */
export const getBusinesses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const cityId = authReq.user?.cityId;

    const {
      page = '1',
      limit = '20',
      category,
      verified,
      search,
      subscriptionPlan,
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {
      cityId,
      accountStatus: 'ACTIVE',
    };

    if (category) {
      where.category = category;
    }

    if (verified === 'true') {
      where.verified = true;
    }

    if (subscriptionPlan) {
      where.subscriptionPlan = subscriptionPlan;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await prisma.business.count({ where });

    // Get businesses with partner priority
    const businesses = await prisma.business.findMany({
      where,
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        category: true,
        logo: true,
        coverImage: true,
        phone: true,
        whatsapp: true,
        address: true,
        latitude: true,
        longitude: true,
        subscriptionPlan: true,
        verified: true,
        viewCount: true,
        _count: {
          select: {
            products: true,
            services: true,
            reviews: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: [
        { subscriptionPlan: 'desc' }, // PARTNER first
        { verified: 'desc' }, // Verified next
        { viewCount: 'desc' }, // Most viewed
      ],
      skip,
      take: limitNum,
    });

    // Calculate average rating for each business
    const businessesWithRating = businesses.map((business: any) => {
      const avgRating =
        business.reviews.length > 0
          ? business.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) /
            business.reviews.length
          : 0;

      const { reviews, ...businessData } = business;

      return {
        ...businessData,
        rating: parseFloat(avgRating.toFixed(1)),
        reviewCount: business._count.reviews,
      };
    });

    res.json({
      success: true,
      data: businessesWithRating,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single business by slug
 */
export const getBusinessBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;

    const business = await prisma.business.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        city: {
          select: {
            id: true,
            name: true,
            state: true,
          },
        },
        products: {
          where: {
            status: 'ACTIVE',
            OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
          },
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            category: true,
          },
        },
        services: {
          where: { status: 'ACTIVE' },
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            priceType: true,
            price: true,
            images: true,
            category: true,
          },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            products: true,
            services: true,
            reviews: true,
            favorites: true,
          },
        },
      },
    });

    if (!business) {
      throw new NotFoundError('Business not found');
    }

    // Calculate average rating
    const avgRating =
      business.reviews.length > 0
        ? business.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) /
          business.reviews.length
        : 0;

    // Increment view count (async, don't wait)
    prisma.business
      .update({
        where: { id: business.id },
        data: { viewCount: { increment: 1 } },
      })
      .catch((err: any) => logger.error('Failed to increment view count', err));

    res.json({
      success: true,
      data: {
        ...business,
        rating: parseFloat(avgRating.toFixed(1)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create business (only for users without a business)
 */
export const createBusiness = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;

    // Check if user already has a business
    const existingBusiness = await prisma.business.findUnique({
      where: { userId },
    });

    if (existingBusiness) {
      throw new ConflictError('User already has a business');
    }

    const {
      name,
      description,
      category,
      phone,
      whatsapp,
      email,
      website,
      address,
      latitude,
      longitude,
      logo,
      coverImage,
      openingHours,
      socialMedia,
    } = req.body;

    if (!name || !category) {
      throw new BadRequestError('Name and category are required');
    }

    // Generate unique slug
    const slug = await generateSlug(name);

    const business = await prisma.business.create({
      data: {
        userId,
        slug,
        name,
        description,
        category,
        phone,
        whatsapp,
        email,
        website,
        address,
        latitude,
        longitude,
        logo,
        coverImage,
        openingHours,
        socialMedia,
        cityId: authReq.user!.cityId,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        city: {
          select: {
            name: true,
            state: true,
          },
        },
      },
    });

    logger.info(`Business created: ${business.id} by user ${userId}`);

    res.status(201).json({
      success: true,
      message: 'Business created successfully',
      data: business,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update business
 */
export const updateBusiness = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;
    const { id } = req.params;

    // Check if business exists and belongs to user
    const existingBusiness = await prisma.business.findUnique({
      where: { id },
    });

    if (!existingBusiness) {
      throw new NotFoundError('Business not found');
    }

    if (existingBusiness.userId !== userId) {
      throw new ForbiddenError('You can only update your own business');
    }

    const {
      name,
      description,
      category,
      phone,
      whatsapp,
      email,
      website,
      address,
      latitude,
      longitude,
      logo,
      coverImage,
      openingHours,
      socialMedia,
    } = req.body;

    // If name changed, regenerate slug
    let slug = existingBusiness.slug;
    if (name && name !== existingBusiness.name) {
      slug = await generateSlug(name);
    }

    const business = await prisma.business.update({
      where: { id },
      data: {
        slug,
        name,
        description,
        category,
        phone,
        whatsapp,
        email,
        website,
        address,
        latitude,
        longitude,
        logo,
        coverImage,
        openingHours,
        socialMedia,
      },
    });

    logger.info(`Business updated: ${id}`);

    res.json({
      success: true,
      message: 'Business updated successfully',
      data: business,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete business
 */
export const deleteBusiness = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;
    const { id } = req.params;

    // Check if business exists and belongs to user
    const business = await prisma.business.findUnique({
      where: { id },
    });

    if (!business) {
      throw new NotFoundError('Business not found');
    }

    if (business.userId !== userId) {
      throw new ForbiddenError('You can only delete your own business');
    }

    // Delete business (cascading deletes handled by Prisma)
    await prisma.business.delete({
      where: { id },
    });

    logger.info(`Business deleted: ${id}`);

    res.json({
      success: true,
      message: 'Business deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get my business
 */
export const getMyBusiness = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;

    const business = await prisma.business.findUnique({
      where: { userId },
      include: {
        city: {
          select: {
            id: true,
            name: true,
            state: true,
          },
        },
        _count: {
          select: {
            products: true,
            services: true,
            stories: true,
            reviews: true,
            favorites: true,
          },
        },
        subscriptions: {
          where: {
            status: 'ACTIVE',
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!business) {
      throw new NotFoundError('Business not found');
    }

    res.json({
      success: true,
      data: business,
    });
  } catch (error) {
    next(error);
  }
};
