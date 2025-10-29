import { Router } from 'express';
import {
  getMe,
  updateProfile,
  changePassword,
  updateEmail,
  deleteAccount,
  getMyStats,
} from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// GET /api/users/me - Get current user profile
router.get('/me', getMe);

// PATCH /api/users/me - Update profile
router.patch('/me', updateProfile);

// GET /api/users/me/stats - Get user statistics
router.get('/me/stats', getMyStats);

// PUT /api/users/me/password - Change password
router.put('/me/password', changePassword);

// PUT /api/users/me/email - Update email
router.put('/me/email', updateEmail);

// DELETE /api/users/me - Delete account
router.delete('/me', deleteAccount);

export default router;
