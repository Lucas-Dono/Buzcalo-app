import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// TODO: Implement review routes
router.get('/', (req, res) => {
  res.json({ message: 'List reviews' });
});

export default router;
