import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import { errorHandler, notFound } from './middleware/errorHandler.middleware';
import { globalRateLimit } from './middleware/rateLimit.middleware';

// Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import businessRoutes from './routes/business.routes';
import productRoutes from './routes/product.routes';
import serviceRoutes from './routes/service.routes';
import storyRoutes from './routes/story.routes';
import favoriteRoutes from './routes/favorite.routes';
import reviewRoutes from './routes/review.routes';
import cityRoutes from './routes/city.routes';
import subscriptionRoutes from './routes/subscription.routes';
import searchRoutes from './routes/search.routes';
import uploadRoutes from './routes/upload.routes';

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
app.use(globalRateLimit);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.env,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;
