import { Router } from 'express';
import {
  getBusinesses,
  getBusinessBySlug,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  getMyBusiness,
} from '../controllers/business.controller';
import { authenticate } from '../middleware/auth.middleware';
import { cityFilter } from '../middleware/cityFilter.middleware';

const router = Router();

// GET /api/businesses - List all businesses (with city filter)
router.get('/', cityFilter, getBusinesses);

// GET /api/businesses/me - Get my business (requires auth)
router.get('/me', authenticate, getMyBusiness);

// GET /api/businesses/:slug - Get business by slug
router.get('/:slug', getBusinessBySlug);

// POST /api/businesses - Create business (requires auth)
router.post('/', authenticate, createBusiness);

// PATCH /api/businesses/:id - Update business (requires auth)
router.patch('/:id', authenticate, updateBusiness);

// DELETE /api/businesses/:id - Delete business (requires auth)
router.delete('/:id', authenticate, deleteBusiness);

export default router;
