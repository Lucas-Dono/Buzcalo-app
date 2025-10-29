import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { cityFilter } from '../middleware/cityFilter.middleware';

const router = Router();

// TODO: Implement product routes
router.get('/', cityFilter, (req, res) => {
  res.json({ message: 'List products' });
});

export default router;
