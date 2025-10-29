import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { BadRequestError, InternalServerError } from '../utils/errors';
import { logger } from '../utils/logger';

// Upload directory
const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

/**
 * Middleware for single image upload
 */
export const uploadSingle = upload.single('image');

/**
 * Middleware for multiple image uploads (max 5)
 */
export const uploadMultiple = upload.array('images', 5);

/**
 * Optimize and save image locally
 */
export const optimizeAndSaveImage = async (
  buffer: Buffer,
  folder: string = 'general'
): Promise<string> => {
  try {
    // Generate unique filename
    const filename = `${Date.now()}-${crypto.randomUUID()}.webp`;
    const folderPath = path.join(UPLOAD_DIR, folder);
    const filepath = path.join(folderPath, filename);

    // Ensure directory exists
    await fs.mkdir(folderPath, { recursive: true });

    // Optimize image: WebP with 80% quality, max 1200px
    await sharp(buffer)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 80, effort: 6 })
      .toFile(filepath);

    // Return public URL path
    return `/uploads/${folder}/${filename}`;
  } catch (error) {
    logger.error('Image optimization error:', error);
    throw new InternalServerError('Failed to process image');
  }
};

/**
 * Generate thumbnail from image
 */
export const generateThumbnail = async (
  buffer: Buffer,
  folder: string = 'general'
): Promise<string> => {
  try {
    const filename = `${Date.now()}-${crypto.randomUUID()}-thumb.webp`;
    const folderPath = path.join(UPLOAD_DIR, folder);
    const filepath = path.join(folderPath, filename);

    // Ensure directory exists
    await fs.mkdir(folderPath, { recursive: true });

    // Create 300x300 thumbnail
    await sharp(buffer)
      .resize(300, 300, { fit: 'cover' })
      .webp({ quality: 70, effort: 6 })
      .toFile(filepath);

    return `/uploads/${folder}/${filename}`;
  } catch (error) {
    logger.error('Thumbnail generation error:', error);
    throw new InternalServerError('Failed to generate thumbnail');
  }
};

/**
 * Middleware to process single uploaded image
 */
export const processSingleImage = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      return next();
    }

    const imageUrl = await optimizeAndSaveImage(req.file.buffer);
    (req as any).imageUrl = imageUrl;

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to process multiple uploaded images
 */
export const processMultipleImages = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return next();
    }

    const uploadPromises = req.files.map((file) =>
      optimizeAndSaveImage(file.buffer)
    );

    const imageUrls = await Promise.all(uploadPromises);
    (req as any).imageUrls = imageUrls;

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Delete image from local storage
 */
export const deleteLocalImage = async (imageUrl: string): Promise<void> => {
  try {
    // imageUrl format: /uploads/folder/filename.webp
    const filepath = path.join(__dirname, '../..', imageUrl);

    // Check if file exists before deleting
    try {
      await fs.access(filepath);
      await fs.unlink(filepath);
      logger.info(`Deleted image from local storage: ${imageUrl}`);
    } catch (error) {
      // File doesn't exist, ignore
      logger.warn(`Image not found for deletion: ${imageUrl}`);
    }
  } catch (error) {
    logger.error('Failed to delete image from local storage:', error);
    // Don't throw error, just log it
  }
};

/**
 * Endpoint to upload single image
 */
export const uploadImageEndpoint = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      throw new BadRequestError('No image file provided');
    }

    const imageUrl = await optimizeAndSaveImage(req.file.buffer, 'general');

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: imageUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Endpoint to upload multiple images
 */
export const uploadImagesEndpoint = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw new BadRequestError('No image files provided');
    }

    const uploadPromises = req.files.map((file) =>
      optimizeAndSaveImage(file.buffer, 'general')
    );

    const imageUrls = await Promise.all(uploadPromises);

    res.json({
      success: true,
      message: `${imageUrls.length} images uploaded successfully`,
      data: {
        urls: imageUrls,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Initialize upload directories
 */
export const initializeUploadDirectories = async (): Promise<void> => {
  const folders = ['general', 'products', 'services', 'businesses', 'users', 'stories'];

  for (const folder of folders) {
    const folderPath = path.join(UPLOAD_DIR, folder);
    await fs.mkdir(folderPath, { recursive: true });
  }

  logger.info('Upload directories initialized');
};
