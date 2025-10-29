import { Router } from 'express';
import { register, login, refresh, me } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { loginRateLimit, registerRateLimit } from '../middleware/rateLimit.middleware';

const router = Router();

router.post('/register', registerRateLimit, register);
router.post('/login', loginRateLimit, login);
router.post('/refresh', refresh);
router.get('/me', authenticate, me);

export default router;
