import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../config/database';
import {
  BadRequestError,
  NotFoundError,
  ConflictError,
} from '../utils/errors';
import { logger } from '../utils/logger';

/**
 * Get all my favorites
 */
export const getMyFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;

    const { type } = req.query; // business, product, service

    const where: any = { userId };

    if (type === 'business') {
      where.businessId = { not: null };
    } else if (type === 'product') {
      where.productId = { not: null };
    } else if (type === 'service') {
      where.serviceId = { not: null };
    }

    const favorites = await prisma.favorite.findMany({
      where,
      select: {
        id: true,
        createdAt: true,
        business: {
          select: {
            id: true,
            slug: true,
            name: true,
            description: true,
            category: true,
            logo: true,
            verified: true,
            subscriptionPlan: true,
            _count: {
              select: {
                reviews: true,
              },
            },
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            price: true,
            condition: true,
            images: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            business: {
              select: {
                name: true,
                slug: true,
                verified: true,
              },
            },
            _count: {
              select: {
                reviews: true,
              },
            },
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            priceType: true,
            price: true,
            priceUnit: true,
            images: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            business: {
              select: {
                name: true,
                slug: true,
                verified: true,
              },
            },
            _count: {
              select: {
                reviews: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: favorites,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add favorite
 */
export const addFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;

    const { businessId, productId, serviceId } = req.body;

    // Ensure exactly one ID is provided
    const idCount = [businessId, productId, serviceId].filter(Boolean).length;
    if (idCount !== 1) {
      throw new BadRequestError(
        'Provide exactly one of: businessId, productId, or serviceId'
      );
    }

    // Check if already favorited
    const existing = await prisma.favorite.findFirst({
      where: {
        userId,
        ...(businessId && { businessId }),
        ...(productId && { productId }),
        ...(serviceId && { serviceId }),
      },
    });

    if (existing) {
      throw new ConflictError('Already added to favorites');
    }

    // Verify the item exists
    if (businessId) {
      const business = await prisma.business.findUnique({
        where: { id: businessId },
      });
      if (!business) {
        throw new NotFoundError('Business not found');
      }
    } else if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!product) {
        throw new NotFoundError('Product not found');
      }
    } else if (serviceId) {
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
      });
      if (!service) {
        throw new NotFoundError('Service not found');
      }
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        businessId,
        productId,
        serviceId,
      },
      include: {
        business: {
          select: {
            name: true,
          },
        },
        product: {
          select: {
            name: true,
          },
        },
        service: {
          select: {
            name: true,
          },
        },
      },
    });

    logger.info(`Favorite added: ${favorite.id} by user ${userId}`);

    res.status(201).json({
      success: true,
      message: 'Added to favorites',
      data: favorite,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove favorite
 */
export const removeFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;
    const { id } = req.params;

    const favorite = await prisma.favorite.findUnique({
      where: { id },
    });

    if (!favorite) {
      throw new NotFoundError('Favorite not found');
    }

    if (favorite.userId !== userId) {
      throw new BadRequestError('You can only remove your own favorites');
    }

    await prisma.favorite.delete({
      where: { id },
    });

    logger.info(`Favorite removed: ${id}`);

    res.json({
      success: true,
      message: 'Removed from favorites',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Check if item is favorited
 */
export const checkFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;

    const { businessId, productId, serviceId } = req.query;

    // Ensure exactly one ID is provided
    const idCount = [businessId, productId, serviceId].filter(Boolean).length;
    if (idCount !== 1) {
      throw new BadRequestError(
        'Provide exactly one of: businessId, productId, or serviceId'
      );
    }

    const favorite = await prisma.favorite.findFirst({
      where: {
        userId,
        ...(businessId && { businessId: businessId as string }),
        ...(productId && { productId: productId as string }),
        ...(serviceId && { serviceId: serviceId as string }),
      },
      select: {
        id: true,
      },
    });

    res.json({
      success: true,
      data: {
        isFavorited: !!favorite,
        favoriteId: favorite?.id || null,
      },
    });
  } catch (error) {
    next(error);
  }
};
