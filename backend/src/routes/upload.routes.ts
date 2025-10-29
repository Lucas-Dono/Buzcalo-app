import { Router } from 'express';
import {
  uploadSingle,
  uploadMultiple,
  uploadImageEndpoint,
  uploadImagesEndpoint,
} from '../middleware/upload.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All upload routes require authentication
router.use(authenticate);

// POST /api/upload/image - Upload single image
router.post('/image', uploadSingle, uploadImageEndpoint);

// POST /api/upload/images - Upload multiple images
router.post('/images', uploadMultiple, uploadImagesEndpoint);

export default router;
