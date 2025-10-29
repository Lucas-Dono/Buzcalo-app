import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/env';
import { BadRequestError, InternalServerError } from '../utils/errors';
import { logger } from '../utils/logger';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
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
 * Upload image to Cloudinary
 */
export const uploadToCloudinary = async (
  buffer: Buffer,
  folder: string = 'buzcalo'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          logger.error('Cloudinary upload error:', error);
          reject(new InternalServerError('Failed to upload image'));
        } else {
          resolve(result!.secure_url);
        }
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Middleware to process single uploaded image
 */
export const processSingleImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      return next();
    }

    const imageUrl = await uploadToCloudinary(req.file.buffer);
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
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return next();
    }

    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer)
    );

    const imageUrls = await Promise.all(uploadPromises);
    (req as any).imageUrls = imageUrls;

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Delete image from Cloudinary
 */
export const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
  try {
    // Extract public_id from URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const publicId = `buzcalo/${fileName.split('.')[0]}`;

    await cloudinary.uploader.destroy(publicId);
    logger.info(`Deleted image from Cloudinary: ${publicId}`);
  } catch (error) {
    logger.error('Failed to delete image from Cloudinary:', error);
    // Don't throw error, just log it
  }
};

/**
 * Endpoint to upload images (can be used directly)
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

    const imageUrl = await uploadToCloudinary(req.file.buffer);

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
      uploadToCloudinary(file.buffer)
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
