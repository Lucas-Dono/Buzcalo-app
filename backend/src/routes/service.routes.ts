import { Router } from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getMyServices,
} from '../controllers/service.controller';
import { authenticate } from '../middleware/auth.middleware';
import { cityFilter } from '../middleware/cityFilter.middleware';
import { createContentRateLimit } from '../middleware/rateLimit.middleware';

const router = Router();

// GET /api/services - List all services (with city filter)
router.get('/', cityFilter, getServices);

// GET /api/services/me - Get my services (requires auth)
router.get('/me', authenticate, getMyServices);

// GET /api/services/:id - Get service by ID
router.get('/:id', getServiceById);

// POST /api/services - Create service (requires auth, rate limited)
router.post('/', authenticate, createContentRateLimit, createService);

// PATCH /api/services/:id - Update service (requires auth)
router.patch('/:id', authenticate, updateService);

// DELETE /api/services/:id - Delete service (requires auth)
router.delete('/:id', authenticate, deleteService);

export default router;
