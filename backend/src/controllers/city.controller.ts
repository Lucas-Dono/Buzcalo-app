import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

/**
 * Get all active cities
 */
export const getCities = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search } = req.query;

    const where: any = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { state: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const cities = await prisma.city.findMany({
      where,
      select: {
        id: true,
        name: true,
        state: true,
        country: true,
        latitude: true,
        longitude: true,
        timezone: true,
        _count: {
          select: {
            users: true,
            businesses: true,
            products: true,
            services: true,
          },
        },
      },
      orderBy: [
        { name: 'asc' },
      ],
    });

    res.json({
      success: true,
      data: cities,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get city by ID
 */
export const getCityById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const city = await prisma.city.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        state: true,
        country: true,
        latitude: true,
        longitude: true,
        timezone: true,
        isActive: true,
        _count: {
          select: {
            users: true,
            businesses: true,
            products: true,
            services: true,
            stories: true,
          },
        },
      },
    });

    if (!city) {
      throw new NotFoundError('City not found');
    }

    if (!city.isActive) {
      throw new NotFoundError('City is not active');
    }

    res.json({
      success: true,
      data: city,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get city statistics
 */
export const getCityStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const city = await prisma.city.findUnique({
      where: { id },
    });

    if (!city) {
      throw new NotFoundError('City not found');
    }

    const [
      usersCount,
      businessesCount,
      productsCount,
      servicesCount,
      storiesCount,
      partnerBusinessesCount,
    ] = await Promise.all([
      prisma.user.count({ where: { cityId: id } }),
      prisma.business.count({ where: { cityId: id } }),
      prisma.product.count({ where: { cityId: id, status: 'ACTIVE' } }),
      prisma.service.count({ where: { cityId: id, status: 'ACTIVE' } }),
      prisma.story.count({ where: { cityId: id, expiresAt: { gt: new Date() } } }),
      prisma.business.count({
        where: { cityId: id, subscriptionPlan: 'PARTNER' },
      }),
    ]);

    res.json({
      success: true,
      data: {
        city: {
          id: city.id,
          name: city.name,
          state: city.state,
        },
        stats: {
          users: usersCount,
          businesses: businessesCount,
          partnerBusinesses: partnerBusinessesCount,
          products: productsCount,
          services: servicesCount,
          activeStories: storiesCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
