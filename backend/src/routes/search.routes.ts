import { Router } from 'express';
import {
  globalSearch,
  searchSuggestions,
  getPopularSearches,
} from '../controllers/search.controller';
import { cityFilter } from '../middleware/cityFilter.middleware';

const router = Router();

// GET /api/search - Global search (with city filter)
router.get('/', cityFilter, globalSearch);

// GET /api/search/suggestions - Search suggestions for autocomplete (with city filter)
router.get('/suggestions', cityFilter, searchSuggestions);

// GET /api/search/popular - Get popular searches (with city filter)
router.get('/popular', cityFilter, getPopularSearches);

export default router;
