import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../config/database';
import { BadRequestError, NotFoundError, ConflictError } from '../utils/errors';
import { hashPassword, verifyPassword } from '../utils/password.util';
import { logger } from '../utils/logger';

/**
 * Get current user profile
 */
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        whatsapp: true,
        avatar: true,
        role: true,
        accountStatus: true,
        city: {
          select: {
            id: true,
            name: true,
            state: true,
          },
        },
        business: {
          select: {
            id: true,
            slug: true,
            name: true,
            description: true,
            category: true,
            logo: true,
            coverImage: true,
            subscriptionPlan: true,
            subscriptionStatus: true,
            verified: true,
            viewCount: true,
          },
        },
        createdAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;
    const { firstName, lastName, phone, whatsapp, avatar } = req.body;

    // Validate phone format if provided
    if (phone && !/^\+?[1-9]\d{1,14}$/.test(phone)) {
      throw new BadRequestError('Invalid phone format');
    }

    if (whatsapp && !/^\+?[1-9]\d{1,14}$/.test(whatsapp)) {
      throw new BadRequestError('Invalid WhatsApp format');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        phone,
        whatsapp,
        avatar,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        whatsapp: true,
        avatar: true,
        role: true,
        updatedAt: true,
      },
    });

    logger.info(`User profile updated: ${userId}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change password
 */
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new BadRequestError('Current password and new password are required');
    }

    if (newPassword.length < 8) {
      throw new BadRequestError('New password must be at least 8 characters');
    }

    // Get user with password hash
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify current password
    const isValidPassword = await verifyPassword(currentPassword, user.passwordHash);
    if (!isValidPassword) {
      throw new BadRequestError('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    logger.info(`Password changed for user: ${userId}`);

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update email
 */
export const updateEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;
    const { newEmail, password } = req.body;

    if (!newEmail || !password) {
      throw new BadRequestError('New email and password are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      throw new BadRequestError('Invalid email format');
    }

    // Get user with password hash
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        passwordHash: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw new BadRequestError('Password is incorrect');
    }

    // Check if new email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail },
    });

    if (existingUser) {
      throw new ConflictError('Email is already in use');
    }

    // Update email
    await prisma.user.update({
      where: { id: userId },
      data: {
        email: newEmail,
      },
    });

    logger.info(`Email updated for user: ${userId} (${user.email} -> ${newEmail})`);

    res.json({
      success: true,
      message: 'Email updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete account
 */
export const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;
    const { password } = req.body;

    if (!password) {
      throw new BadRequestError('Password is required to delete account');
    }

    // Get user with password hash
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        business: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw new BadRequestError('Password is incorrect');
    }

    // Delete user and all related data (cascading deletes handled by Prisma schema)
    await prisma.user.delete({
      where: { id: userId },
    });

    logger.info(`Account deleted: ${userId} (${user.email})`);

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's statistics (for business owners)
 */
export const getMyStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user!.id;

    // Get counts
    const [productsCount, servicesCount, storiesCount, reviewsCount, favoritesCount] =
      await Promise.all([
        prisma.product.count({ where: { userId } }),
        prisma.service.count({ where: { userId } }),
        prisma.story.count({ where: { userId } }),
        prisma.review.count({
          where: {
            OR: [
              { product: { userId } },
              { service: { userId } },
              { business: { userId } },
            ],
          },
        }),
        prisma.favorite.count({
          where: {
            OR: [
              { product: { userId } },
              { service: { userId } },
              { businessId: authReq.user!.businessId },
            ],
          },
        }),
      ]);

    // Get average rating
    const reviews = await prisma.review.findMany({
      where: {
        OR: [
          { product: { userId } },
          { service: { userId } },
          { business: { userId } },
        ],
      },
      select: {
        rating: true,
      },
    });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length
        : 0;

    // Get business view count if applicable
    let businessViewCount = 0;
    if (authReq.user!.businessId) {
      const business = await prisma.business.findUnique({
        where: { id: authReq.user!.businessId },
        select: { viewCount: true },
      });
      businessViewCount = business?.viewCount || 0;
    }

    res.json({
      success: true,
      data: {
        products: productsCount,
        services: servicesCount,
        stories: storiesCount,
        reviews: reviewsCount,
        favorites: favoritesCount,
        averageRating: parseFloat(averageRating.toFixed(1)),
        businessViews: businessViewCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
