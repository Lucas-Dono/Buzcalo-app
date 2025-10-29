import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../config/database';
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from '../utils/errors';
import { logger } from '../utils/logger';

/**
 * Get reviews for an item (business, product, or service)
 */
export const getReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { businessId, productId, serviceId, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Ensure exactly one ID is provided
    const idCount = [businessId, productId, serviceId].filter(Boolean).length;
    if (idCount !== 1) {
      throw new BadRequestError(
        'Provide exactly one of: businessId, productId, or serviceId'
      );
    }

    const where: any = {};
    if (businessId) where.businessId = businessId;
    if (productId) where.productId = productId;
    if (serviceId) where.serviceId = serviceId;

    const total = await prisma.review.count({ where });

    const reviews = await prisma.review.findMany({
      where,
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    });

    // Calculate average rating and distribution
    const allReviews = await prisma.review.findMany({
      where,
      select: { rating: true },
    });

    const avgRating =
      allReviews.length > 0
        ? allReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / allReviews.length
        : 0;

    // Rating distribution (1-5 stars)
    const distribution = {
      1: allReviews.filter((r: { rating: number }) => r.rating === 1).length,
      2: allReviews.filter((r: { rating: number }) => r.rating === 2).length,
      3: allReviews.filter((r: { rating: number }) => r.rating === 3).length,
      4: allReviews.filter((r: { rating: number }) => r.rating === 4).length,
      5: allReviews.filter((r: { rating: number }) => r.rating === 5).length,
    };

    res.json({
      success: true,
      data: reviews,
      meta: {
        averageRating: parseFloat(avgRating.toFixed(1)),
        totalReviews: total,
        distribution,
      },
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
 * Create review
 */
export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;

    const { businessId, productId, serviceId, rating, comment } = req.body;

    // Ensure exactly one ID is provided
    const idCount = [businessId, productId, serviceId].filter(Boolean).length;
    if (idCount !== 1) {
      throw new BadRequestError(
        'Provide exactly one of: businessId, productId, or serviceId'
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      throw new BadRequestError('Rating must be between 1 and 5');
    }

    // Check if user already reviewed this item
    const existing = await prisma.review.findFirst({
      where: {
        userId,
        ...(businessId && { businessId }),
        ...(productId && { productId }),
        ...(serviceId && { serviceId }),
      },
    });

    if (existing) {
      throw new ConflictError('You have already reviewed this item');
    }

    // Verify the item exists
    if (businessId) {
      const business = await prisma.business.findUnique({
        where: { id: businessId },
      });
      if (!business) {
        throw new NotFoundError('Business not found');
      }
      // Prevent reviewing own business
      if (business.userId === userId) {
        throw new BadRequestError('You cannot review your own business');
      }
    } else if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!product) {
        throw new NotFoundError('Product not found');
      }
      // Prevent reviewing own product
      if (product.userId === userId) {
        throw new BadRequestError('You cannot review your own product');
      }
    } else if (serviceId) {
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
      });
      if (!service) {
        throw new NotFoundError('Service not found');
      }
      // Prevent reviewing own service
      if (service.userId === userId) {
        throw new BadRequestError('You cannot review your own service');
      }
    }

    const review = await prisma.review.create({
      data: {
        userId,
        businessId,
        productId,
        serviceId,
        rating,
        comment,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    logger.info(`Review created: ${review.id} by user ${userId}`);

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update review
 */
export const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;
    const { id } = req.params;

    const { rating, comment } = req.body;

    if (rating && (rating < 1 || rating > 5)) {
      throw new BadRequestError('Rating must be between 1 and 5');
    }

    const existingReview = await prisma.review.findUnique({
      where: { id },
    });

    if (!existingReview) {
      throw new NotFoundError('Review not found');
    }

    if (existingReview.userId !== userId) {
      throw new ForbiddenError('You can only update your own reviews');
    }

    const review = await prisma.review.update({
      where: { id },
      data: {
        rating,
        comment,
      },
    });

    logger.info(`Review updated: ${id}`);

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete review
 */
export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenError('You can only delete your own reviews');
    }

    await prisma.review.delete({
      where: { id },
    });

    logger.info(`Review deleted: ${id}`);

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get my reviews
 */
export const getMyReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;

    const reviews = await prisma.review.findMany({
      where: { userId },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        updatedAt: true,
        business: {
          select: {
            id: true,
            slug: true,
            name: true,
            logo: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            images: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            images: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};
