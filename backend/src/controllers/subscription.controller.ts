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
 * Get my subscription
 */
export const getMySubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const businessId = authReq.user!.businessId;

    if (!businessId) {
      throw new BadRequestError('You need a business to have a subscription');
    }

    // Get business with subscription info
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: {
        id: true,
        name: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        subscriptionStartDate: true,
        subscriptionEndDate: true,
        subscriptions: {
          where: {
            status: 'ACTIVE',
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            id: true,
            plan: true,
            status: true,
            amount: true,
            paymentMethod: true,
            startDate: true,
            endDate: true,
            autoRenew: true,
            createdAt: true,
          },
        },
      },
    });

    if (!business) {
      throw new NotFoundError('Business not found');
    }

    res.json({
      success: true,
      data: {
        business: {
          id: business.id,
          name: business.name,
          currentPlan: business.subscriptionPlan,
          currentStatus: business.subscriptionStatus,
          startDate: business.subscriptionStartDate,
          endDate: business.subscriptionEndDate,
        },
        activeSubscription: business.subscriptions[0] || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Subscribe to Plan Partner
 */
export const subscribe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const businessId = authReq.user!.businessId;

    if (!businessId) {
      throw new BadRequestError('You need a business to subscribe');
    }

    const { paymentMethod, amount } = req.body;

    if (!paymentMethod || !amount) {
      throw new BadRequestError('Payment method and amount are required');
    }

    // Validate amount (1500-2500 ARS)
    if (amount < 1500 || amount > 2500) {
      throw new BadRequestError('Amount must be between 1500 and 2500 ARS');
    }

    // Get business
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundError('Business not found');
    }

    // Check if already has active subscription
    const existingActiveSubscription = await prisma.subscription.findFirst({
      where: {
        businessId,
        status: 'ACTIVE',
      },
    });

    if (existingActiveSubscription) {
      throw new BadRequestError('You already have an active subscription');
    }

    // Calculate dates (30 days from now)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    // Create subscription
    const subscription = await prisma.subscription.create({
      data: {
        businessId,
        plan: 'PARTNER',
        status: paymentMethod === 'MERCADOPAGO' ? 'PAYMENT_PENDING' : 'ACTIVE',
        amount,
        paymentMethod,
        startDate,
        endDate,
        autoRenew: true,
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        amount,
        paymentMethod,
        status: paymentMethod === 'MERCADOPAGO' ? 'PENDING' : 'COMPLETED',
      },
    });

    // If not MercadoPago (manual payment), activate immediately
    if (paymentMethod !== 'MERCADOPAGO') {
      await prisma.business.update({
        where: { id: businessId },
        data: {
          subscriptionPlan: 'PARTNER',
          subscriptionStatus: 'ACTIVE',
          subscriptionStartDate: startDate,
          subscriptionEndDate: endDate,
        },
      });
    }

    logger.info(`Subscription created: ${subscription.id} for business ${businessId}`);

    res.status(201).json({
      success: true,
      message:
        paymentMethod === 'MERCADOPAGO'
          ? 'Subscription pending payment confirmation'
          : 'Subscription activated successfully',
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel subscription
 */
export const cancelSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const businessId = authReq.user!.businessId;

    if (!businessId) {
      throw new BadRequestError('You need a business to cancel subscription');
    }

    // Get active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        businessId,
        status: 'ACTIVE',
      },
    });

    if (!subscription) {
      throw new NotFoundError('No active subscription found');
    }

    // Cancel subscription (will remain active until end date)
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        autoRenew: false,
        status: 'CANCELLED',
      },
    });

    // Update business status
    await prisma.business.update({
      where: { id: businessId },
      data: {
        subscriptionStatus: 'CANCELLED',
      },
    });

    logger.info(`Subscription cancelled: ${subscription.id}`);

    res.json({
      success: true,
      message: 'Subscription cancelled. Benefits will remain until end date.',
      data: {
        endsAt: subscription.endDate,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get subscription history
 */
export const getSubscriptionHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const businessId = authReq.user!.businessId;

    if (!businessId) {
      throw new BadRequestError('You need a business to view subscription history');
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { businessId },
      include: {
        payments: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * MercadoPago webhook (for payment confirmation)
 */
export const mercadoPagoWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type, data } = req.body;

    // Handle payment notification
    if (type === 'payment') {
      const paymentId = data.id;

      // TODO: Verify payment with MercadoPago API
      // For now, we'll just log it
      logger.info(`MercadoPago payment notification: ${paymentId}`);

      // Find payment and update status
      const payment = await prisma.payment.findFirst({
        where: {
          externalId: paymentId,
        },
        include: {
          subscription: true,
        },
      });

      if (payment) {
        // Update payment status
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'COMPLETED',
          },
        });

        // Activate subscription
        await prisma.subscription.update({
          where: { id: payment.subscription.id },
          data: {
            status: 'ACTIVE',
          },
        });

        // Update business
        await prisma.business.update({
          where: { id: payment.subscription.businessId },
          data: {
            subscriptionPlan: 'PARTNER',
            subscriptionStatus: 'ACTIVE',
            subscriptionStartDate: payment.subscription.startDate,
            subscriptionEndDate: payment.subscription.endDate,
          },
        });

        logger.info(`Subscription activated via webhook: ${payment.subscription.id}`);
      }
    }

    res.json({ success: true });
  } catch (error) {
    logger.error('MercadoPago webhook error:', error);
    res.json({ success: false });
  }
};
