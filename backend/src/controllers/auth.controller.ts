import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { hashPassword, comparePassword, validatePasswordStrength } from '../utils/password.util';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.util';
import { BadRequestError, UnauthorizedError, ConflictError } from '../utils/errors';
import { generateSlug, generateUniqueSlug } from '../utils/slug.util';
import logger from '../utils/logger';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phone,
      cityId,
      role,
      businessData,
    } = req.body;

    // Validations
    if (password !== confirmPassword) {
      throw new BadRequestError('Passwords do not match');
    }

    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      throw new BadRequestError(passwordValidation.errors.join(', '));
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Check if city exists
    const city = await prisma.city.findFirst({
      where: { id: cityId, active: true },
    });
    if (!city) {
      throw new BadRequestError('Invalid or inactive city');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        cityId,
        role,
      },
    });

    // If role requires business, create it
    if (['BUSINESS', 'STREET_VENDOR', 'SERVICE_PROVIDER'].includes(role) && businessData) {
      const baseSlug = generateSlug(businessData.name);
      const slug = await generateUniqueSlug(
        baseSlug,
        async (s) => {
          const existing = await prisma.business.findUnique({ where: { slug: s } });
          return !!existing;
        }
      );

      await prisma.business.create({
        data: {
          userId: user.id,
          name: businessData.name,
          slug,
          category: businessData.category,
          description: businessData.description,
          phone: businessData.phone || phone,
          address: businessData.address,
          usualLocations: businessData.usualLocations,
          serviceCategories: businessData.serviceCategories,
          coverageArea: businessData.coverageArea,
          whatsapp: businessData.whatsapp,
          website: businessData.website,
        },
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      cityId: user.cityId,
    });

    const refreshToken = generateRefreshToken({
      sub: user.id,
    });

    logger.info(`User registered: ${user.email}`);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { business: true },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Check if account is active
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedError('Account is not active');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      cityId: user.cityId,
      businessId: user.business?.id,
    });

    const refreshToken = generateRefreshToken({
      sub: user.id,
    });

    logger.info(`User logged in: ${user.email}`);

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        business: user.business ? {
          id: user.business.id,
          name: user.business.name,
          slug: user.business.slug,
        } : null,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new BadRequestError('Refresh token is required');
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { business: true },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      cityId: user.cityId,
      businessId: user.business?.id,
    });

    const newRefreshToken = generateRefreshToken({
      sub: user.id,
    });

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        business: true,
        city: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatarUrl: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
            category: true,
            verified: true,
            subscriptionPlan: true,
            subscriptionStatus: true,
          },
        },
        city: {
          select: {
            id: true,
            name: true,
            province: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
