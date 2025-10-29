import { Router } from 'express';
import {
  getCities,
  getCityById,
  getCityStats,
} from '../controllers/city.controller';

const router = Router();

// GET /api/cities - List all active cities
router.get('/', getCities);

// GET /api/cities/:id - Get city by ID
router.get('/:id', getCityById);

// GET /api/cities/:id/stats - Get city statistics
router.get('/:id/stats', getCityStats);

export default router;
