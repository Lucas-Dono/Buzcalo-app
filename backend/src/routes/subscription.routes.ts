import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// TODO: Implement subscription routes
router.get('/me', authenticate, (req, res) => {
  res.json({ message: 'Current subscription' });
});

export default router;
