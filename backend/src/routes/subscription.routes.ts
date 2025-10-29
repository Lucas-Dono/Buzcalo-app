import { Router } from 'express';
import {
  getMySubscription,
  subscribe,
  cancelSubscription,
  getSubscriptionHistory,
  mercadoPagoWebhook,
} from '../controllers/subscription.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// GET /api/subscriptions/me - Get my subscription (requires auth)
router.get('/me', authenticate, getMySubscription);

// GET /api/subscriptions/history - Get subscription history (requires auth)
router.get('/history', authenticate, getSubscriptionHistory);

// POST /api/subscriptions/subscribe - Subscribe to Plan Partner (requires auth)
router.post('/subscribe', authenticate, subscribe);

// POST /api/subscriptions/cancel - Cancel subscription (requires auth)
router.post('/cancel', authenticate, cancelSubscription);

// POST /api/subscriptions/webhook/mercadopago - MercadoPago webhook (no auth)
router.post('/webhook/mercadopago', mercadoPagoWebhook);

export default router;
