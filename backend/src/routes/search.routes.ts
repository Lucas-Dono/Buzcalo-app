import { Router } from 'express';
import { cityFilter } from '../middleware/cityFilter.middleware';

const router = Router();

// TODO: Implement search routes
router.get('/', cityFilter, (req, res) => {
  res.json({ message: 'Search results' });
});

export default router;
