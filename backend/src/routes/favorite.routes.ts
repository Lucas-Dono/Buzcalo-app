import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// TODO: Implement favorite routes
router.get('/', authenticate, (req, res) => {
  res.json({ message: 'List favorites' });
});

export default router;
