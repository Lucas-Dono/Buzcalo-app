import { Router } from 'express';
import {
  getMyFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
} from '../controllers/favorite.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All favorite routes require authentication
router.use(authenticate);

// GET /api/favorites - Get my favorites
router.get('/', getMyFavorites);

// GET /api/favorites/check - Check if item is favorited
router.get('/check', checkFavorite);

// POST /api/favorites - Add favorite
router.post('/', addFavorite);

// DELETE /api/favorites/:id - Remove favorite
router.delete('/:id', removeFavorite);

export default router;
