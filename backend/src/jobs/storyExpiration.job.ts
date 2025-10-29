import cron from 'node-cron';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

/**
 * Delete expired stories
 * Runs every day at 23:59
 */
export const startStoryExpirationJob = (): void => {
  // Run at 23:59 every day
  cron.schedule('59 23 * * *', async () => {
    try {
      logger.info('Running story expiration job...');

      const now = new Date();

      // Find all expired stories
      const expiredStories = await prisma.story.findMany({
        where: {
          expiresAt: {
            lte: now,
          },
        },
        select: {
          id: true,
          userId: true,
        },
      });

      if (expiredStories.length > 0) {
        // Delete expired stories
        const result = await prisma.story.deleteMany({
          where: {
            expiresAt: {
              lte: now,
            },
          },
        });

        logger.info(`Deleted ${result.count} expired stories`);
      } else {
        logger.info('No expired stories found');
      }
    } catch (error) {
      logger.error('Error in story expiration job:', error);
    }
  });

  logger.info('Story expiration job scheduled (runs daily at 23:59)');
};

/**
 * Delete old expired stories (cleanup job)
 * Runs once a week on Sunday at 02:00
 */
export const startOldStoriesCleanupJob = (): void => {
  // Run at 02:00 on Sundays
  cron.schedule('0 2 * * 0', async () => {
    try {
      logger.info('Running old stories cleanup job...');

      // Delete stories expired more than 7 days ago
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const result = await prisma.story.deleteMany({
        where: {
          expiresAt: {
            lte: weekAgo,
          },
        },
      });

      logger.info(`Cleaned up ${result.count} old expired stories`);
    } catch (error) {
      logger.error('Error in old stories cleanup job:', error);
    }
  });

  logger.info('Old stories cleanup job scheduled (runs weekly on Sunday at 02:00)');
};

/**
 * Check and expire subscriptions
 * Runs once a day at 00:00
 */
export const startSubscriptionExpirationJob = (): void => {
  // Run at 00:00 every day
  cron.schedule('0 0 * * *', async () => {
    try {
      logger.info('Running subscription expiration job...');

      const now = new Date();

      // Find expired subscriptions
      const expiredSubscriptions = await prisma.subscription.findMany({
        where: {
          status: 'ACTIVE',
          endDate: {
            lte: now,
          },
        },
        include: {
          business: true,
        },
      });

      if (expiredSubscriptions.length > 0) {
        // Update expired subscriptions
        for (const subscription of expiredSubscriptions) {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
              status: 'EXPIRED',
            },
          });

          // Downgrade business to FREE plan
          await prisma.business.update({
            where: { id: subscription.businessId },
            data: {
              subscriptionPlan: 'FREE',
              subscriptionStatus: 'EXPIRED',
            },
          });
        }

        logger.info(`Expired ${expiredSubscriptions.length} subscriptions`);
      } else {
        logger.info('No expired subscriptions found');
      }
    } catch (error) {
      logger.error('Error in subscription expiration job:', error);
    }
  });

  logger.info('Subscription expiration job scheduled (runs daily at 00:00)');
};

/**
 * Start all cron jobs
 */
export const startAllJobs = (): void => {
  startStoryExpirationJob();
  startOldStoriesCleanupJob();
  startSubscriptionExpirationJob();
  logger.info('All cron jobs started');
};
