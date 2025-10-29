import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../config/database';
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from '../utils/errors';
import { logger } from '../utils/logger';

/**
 * Get all services (with filtering and pagination)
 */
export const getServices = async (
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
      priceType,
      minPrice,
      maxPrice,
      search,
      userId,
      businessId,
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {
      cityId,
      status: 'ACTIVE',
    };

    if (category) {
      where.category = category;
    }

    if (priceType) {
      where.priceType = priceType;
    }

    if ((minPrice || maxPrice) && priceType !== 'quote') {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    if (userId) {
      where.userId = userId;
    }

    if (businessId) {
      where.businessId = businessId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await prisma.service.count({ where });

    // Get services
    const services = await prisma.service.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        priceType: true,
        price: true,
        priceUnit: true,
        images: true,
        coverageArea: true,
        createdAt: true,
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
        _count: {
          select: {
            reviews: true,
            favorites: true,
          },
        },
      },
      orderBy: [
        { business: { subscriptionPlan: 'desc' } }, // PARTNER services first
        { createdAt: 'desc' },
      ],
      skip,
      take: limitNum,
    });

    res.json({
      success: true,
      data: services,
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
 * Get single service by ID
 */
export const getServiceById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
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
            description: true,
            logo: true,
            verified: true,
            subscriptionPlan: true,
            address: true,
            latitude: true,
            longitude: true,
            phone: true,
            whatsapp: true,
          },
        },
        city: {
          select: {
            id: true,
            name: true,
            state: true,
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
            reviews: true,
            favorites: true,
          },
        },
      },
    });

    if (!service) {
      throw new NotFoundError('Service not found');
    }

    // Calculate average rating
    const avgRating =
      service.reviews.length > 0
        ? service.reviews.reduce((sum, r) => sum + r.rating, 0) /
          service.reviews.length
        : 0;

    // Increment view count (async, don't wait)
    prisma.service
      .update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      })
      .catch((err) => logger.error('Failed to increment view count', err));

    res.json({
      success: true,
      data: {
        ...service,
        rating: parseFloat(avgRating.toFixed(1)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create service
 */
export const createService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;

    const {
      name,
      description,
      category,
      priceType,
      price,
      priceUnit,
      coverageArea,
      images,
      latitude,
      longitude,
    } = req.body;

    if (!name || !category || !priceType) {
      throw new BadRequestError('Name, category, and priceType are required');
    }

    if (priceType !== 'quote' && (price === undefined || price < 0)) {
      throw new BadRequestError(
        'Price is required and must be positive for non-quote services'
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

    const service = await prisma.service.create({
      data: {
        userId,
        businessId: user?.business?.id,
        cityId: user!.cityId,
        name,
        description,
        category,
        priceType,
        price: priceType === 'quote' ? null : price,
        priceUnit,
        coverageArea,
        images,
        latitude,
        longitude,
        status: 'ACTIVE',
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

    logger.info(`Service created: ${service.id} by user ${userId}`);

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update service
 */
export const updateService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;
    const { id } = req.params;

    // Check if service exists and belongs to user
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      throw new NotFoundError('Service not found');
    }

    if (existingService.userId !== userId) {
      throw new ForbiddenError('You can only update your own services');
    }

    const {
      name,
      description,
      category,
      priceType,
      price,
      priceUnit,
      coverageArea,
      images,
      latitude,
      longitude,
      status,
    } = req.body;

    if (price !== undefined && price < 0) {
      throw new BadRequestError('Price must be a positive number');
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        name,
        description,
        category,
        priceType,
        price: priceType === 'quote' ? null : price,
        priceUnit,
        coverageArea,
        images,
        latitude,
        longitude,
        status,
      },
    });

    logger.info(`Service updated: ${id}`);

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete service
 */
export const deleteService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;
    const { id } = req.params;

    // Check if service exists and belongs to user
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundError('Service not found');
    }

    if (service.userId !== userId) {
      throw new ForbiddenError('You can only delete your own services');
    }

    // Soft delete by setting status to INACTIVE
    await prisma.service.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });

    logger.info(`Service deleted (soft): ${id}`);

    res.json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get my services
 */
export const getMyServices = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;

    const { status, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const total = await prisma.service.count({ where });

    const services = await prisma.service.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        priceType: true,
        price: true,
        priceUnit: true,
        images: true,
        coverageArea: true,
        status: true,
        viewCount: true,
        createdAt: true,
        _count: {
          select: {
            reviews: true,
            favorites: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    });

    res.json({
      success: true,
      data: services,
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
