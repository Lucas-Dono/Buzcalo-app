import { Router } from 'express';
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  getMyReviews,
} from '../controllers/review.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// GET /api/reviews - Get reviews for an item (requires query params)
router.get('/', getReviews);

// GET /api/reviews/me - Get my reviews (requires auth)
router.get('/me', authenticate, getMyReviews);

// POST /api/reviews - Create review (requires auth)
router.post('/', authenticate, createReview);

// PATCH /api/reviews/:id - Update review (requires auth)
router.patch('/:id', authenticate, updateReview);

// DELETE /api/reviews/:id - Delete review (requires auth)
router.delete('/:id', authenticate, deleteReview);

export default router;
