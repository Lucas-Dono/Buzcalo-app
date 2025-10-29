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
 * Get all products (with filtering and pagination)
 */
export const getProducts = async (
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
      minPrice,
      maxPrice,
      search,
      userId,
      businessId,
      condition,
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {
      cityId,
      status: 'ACTIVE',
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    };

    if (category) {
      where.category = category;
    }

    if (condition) {
      where.condition = condition;
    }

    if (minPrice || maxPrice) {
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
    const total = await prisma.product.count({ where });

    // Get products
    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        price: true,
        condition: true,
        images: true,
        stock: true,
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
        _count: {
          select: {
            reviews: true,
            favorites: true,
          },
        },
      },
      orderBy: [
        { business: { subscriptionPlan: 'desc' } }, // PARTNER products first
        { createdAt: 'desc' },
      ],
      skip,
      take: limitNum,
    });

    res.json({
      success: true,
      data: products,
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
 * Get single product by ID
 */
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
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

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    // Check if expired
    if (product.expiresAt && product.expiresAt < new Date()) {
      throw new NotFoundError('Product has expired');
    }

    // Calculate average rating
    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
          product.reviews.length
        : 0;

    // Increment view count (async, don't wait)
    prisma.product
      .update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      })
      .catch((err) => logger.error('Failed to increment view count', err));

    res.json({
      success: true,
      data: {
        ...product,
        rating: parseFloat(avgRating.toFixed(1)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create product
 */
export const createProduct = async (
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
      price,
      condition,
      stock,
      images,
      latitude,
      longitude,
      expiresAt,
    } = req.body;

    if (!name || !category || price === undefined) {
      throw new BadRequestError('Name, category, and price are required');
    }

    if (price < 0) {
      throw new BadRequestError('Price must be a positive number');
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

    const product = await prisma.product.create({
      data: {
        userId,
        businessId: user?.business?.id,
        cityId: user!.cityId,
        name,
        description,
        category,
        price,
        condition,
        stock,
        images,
        latitude,
        longitude,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
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

    logger.info(`Product created: ${product.id} by user ${userId}`);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update product
 */
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;
    const { id } = req.params;

    // Check if product exists and belongs to user
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundError('Product not found');
    }

    if (existingProduct.userId !== userId) {
      throw new ForbiddenError('You can only update your own products');
    }

    const {
      name,
      description,
      category,
      price,
      condition,
      stock,
      images,
      latitude,
      longitude,
      expiresAt,
      status,
    } = req.body;

    if (price !== undefined && price < 0) {
      throw new BadRequestError('Price must be a positive number');
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        category,
        price,
        condition,
        stock,
        images,
        latitude,
        longitude,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        status,
      },
    });

    logger.info(`Product updated: ${id}`);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete product
 */
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;
    const { id } = req.params;

    // Check if product exists and belongs to user
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (product.userId !== userId) {
      throw new ForbiddenError('You can only delete your own products');
    }

    // Soft delete by setting status to INACTIVE
    await prisma.product.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });

    logger.info(`Product deleted (soft): ${id}`);

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get my products
 */
export const getMyProducts = async (
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

    const total = await prisma.product.count({ where });

    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        price: true,
        condition: true,
        images: true,
        stock: true,
        status: true,
        expiresAt: true,
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
      data: products,
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
