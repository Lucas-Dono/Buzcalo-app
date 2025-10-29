import { Router } from 'express';
import {
  getStories,
  getStoryById,
  createStory,
  deleteStory,
  incrementStoryClick,
  getMyStories,
  getStoryStats,
} from '../controllers/story.controller';
import { authenticate } from '../middleware/auth.middleware';
import { cityFilter } from '../middleware/cityFilter.middleware';
import { createStoryRateLimit } from '../middleware/rateLimit.middleware';

const router = Router();

// GET /api/stories - List active stories (with city filter)
router.get('/', cityFilter, getStories);

// GET /api/stories/me - Get my stories (requires auth)
router.get('/me', authenticate, getMyStories);

// GET /api/stories/:id - Get story by ID
router.get('/:id', getStoryById);

// GET /api/stories/:id/stats - Get story statistics (requires auth)
router.get('/:id/stats', authenticate, getStoryStats);

// POST /api/stories - Create story (requires auth, rate limited to 5/day)
router.post('/', authenticate, createStoryRateLimit, createStory);

// POST /api/stories/:id/click - Increment click count
router.post('/:id/click', incrementStoryClick);

// DELETE /api/stories/:id - Delete story (requires auth)
router.delete('/:id', authenticate, deleteStory);

export default router;
