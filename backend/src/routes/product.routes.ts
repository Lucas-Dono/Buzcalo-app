import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
} from '../controllers/product.controller';
import { authenticate } from '../middleware/auth.middleware';
import { cityFilter } from '../middleware/cityFilter.middleware';
import { createContentRateLimit } from '../middleware/rateLimit.middleware';

const router = Router();

// GET /api/products - List all products (with city filter)
router.get('/', cityFilter, getProducts);

// GET /api/products/me - Get my products (requires auth)
router.get('/me', authenticate, getMyProducts);

// GET /api/products/:id - Get product by ID
router.get('/:id', getProductById);

// POST /api/products - Create product (requires auth, rate limited)
router.post('/', authenticate, createContentRateLimit, createProduct);

// PATCH /api/products/:id - Update product (requires auth)
router.patch('/:id', authenticate, updateProduct);

// DELETE /api/products/:id - Delete product (requires auth)
router.delete('/:id', authenticate, deleteProduct);

export default router;
