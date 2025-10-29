import { Router } from 'express';

const router = Router();

// TODO: Implement city routes
router.get('/', (req, res) => {
  res.json({ message: 'List cities' });
});

export default router;
