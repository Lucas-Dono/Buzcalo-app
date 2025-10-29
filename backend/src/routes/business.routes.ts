import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { cityFilter } from '../middleware/cityFilter.middleware';

const router = Router();

// TODO: Implement business routes
router.get('/', cityFilter, (req, res) => {
  res.json({ message: 'List businesses' });
});

export default router;
