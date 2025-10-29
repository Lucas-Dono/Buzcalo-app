import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// TODO: Implement user routes
router.get('/me', authenticate, (req, res) => {
  res.json({ message: 'User profile' });
});

export default router;
