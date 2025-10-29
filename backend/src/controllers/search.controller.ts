import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../config/database';
import { BadRequestError } from '../utils/errors';

/**
 * Global search across businesses, products, and services
 */
export const globalSearch = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const cityId = authReq.user?.cityId;

    const { q, limit = '10' } = req.query;

    if (!q || (q as string).trim().length < 2) {
      throw new BadRequestError('Search query must be at least 2 characters');
    }

    const searchTerm = (q as string).trim();
    const limitNum = Math.min(parseInt(limit as string, 10), 50); // Max 50 results per type

    // Search businesses
    const businesses = await prisma.business.findMany({
      where: {
        cityId,
        accountStatus: 'ACTIVE',
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { category: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
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
      orderBy: [
        { subscriptionPlan: 'desc' },
        { verified: 'desc' },
        { viewCount: 'desc' },
      ],
      take: limitNum,
    });

    // Search products
    const products = await prisma.product.findMany({
      where: {
        cityId,
        status: 'ACTIVE',
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        AND: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { category: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
      },
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
            slug: true,
            name: true,
            verified: true,
            subscriptionPlan: true,
          },
        },
      },
      orderBy: [
        { business: { subscriptionPlan: 'desc' } },
        { createdAt: 'desc' },
      ],
      take: limitNum,
    });

    // Search services
    const services = await prisma.service.findMany({
      where: {
        cityId,
        status: 'ACTIVE',
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { category: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
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
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        business: {
          select: {
            slug: true,
            name: true,
            verified: true,
            subscriptionPlan: true,
          },
        },
      },
      orderBy: [
        { business: { subscriptionPlan: 'desc' } },
        { createdAt: 'desc' },
      ],
      take: limitNum,
    });

    res.json({
      success: true,
      data: {
        businesses,
        products,
        services,
      },
      meta: {
        query: searchTerm,
        counts: {
          businesses: businesses.length,
          products: products.length,
          services: services.length,
          total: businesses.length + products.length + services.length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search suggestions (for autocomplete)
 */
export const searchSuggestions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const cityId = authReq.user?.cityId;

    const { q } = req.query;

    if (!q || (q as string).trim().length < 2) {
      res.json({
        success: true,
        data: [],
      });
      return;
    }

    const searchTerm = (q as string).trim();

    // Get top 5 matches from each category
    const [businessNames, productNames, serviceNames] = await Promise.all([
      prisma.business.findMany({
        where: {
          cityId,
          accountStatus: 'ACTIVE',
          name: { contains: searchTerm, mode: 'insensitive' },
        },
        select: {
          name: true,
          category: true,
        },
        take: 5,
      }),
      prisma.product.findMany({
        where: {
          cityId,
          status: 'ACTIVE',
          name: { contains: searchTerm, mode: 'insensitive' },
        },
        select: {
          name: true,
          category: true,
        },
        take: 5,
      }),
      prisma.service.findMany({
        where: {
          cityId,
          status: 'ACTIVE',
          name: { contains: searchTerm, mode: 'insensitive' },
        },
        select: {
          name: true,
          category: true,
        },
        take: 5,
      }),
    ]);

    const suggestions = [
      ...businessNames.map((b) => ({
        text: b.name,
        type: 'business',
        category: b.category,
      })),
      ...productNames.map((p) => ({
        text: p.name,
        type: 'product',
        category: p.category,
      })),
      ...serviceNames.map((s) => ({
        text: s.name,
        type: 'service',
        category: s.category,
      })),
    ];

    // Remove duplicates and limit to 15
    const uniqueSuggestions = suggestions
      .filter(
        (suggestion, index, self) =>
          index === self.findIndex((s) => s.text === suggestion.text)
      )
      .slice(0, 15);

    res.json({
      success: true,
      data: uniqueSuggestions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get popular searches
 */
export const getPopularSearches = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const cityId = authReq.user?.cityId;

    // Get most viewed products and services categories
    const [productCategories, serviceCategories] = await Promise.all([
      prisma.product.groupBy({
        by: ['category'],
        where: {
          cityId,
          status: 'ACTIVE',
        },
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
        take: 5,
      }),
      prisma.service.groupBy({
        by: ['category'],
        where: {
          cityId,
          status: 'ACTIVE',
        },
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
        take: 5,
      }),
    ]);

    const popularSearches = [
      ...productCategories.map((c) => ({
        term: c.category,
        type: 'product',
        count: c._count.id,
      })),
      ...serviceCategories.map((c) => ({
        term: c.category,
        type: 'service',
        count: c._count.id,
      })),
    ]
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    res.json({
      success: true,
      data: popularSearches,
    });
  } catch (error) {
    next(error);
  }
};
