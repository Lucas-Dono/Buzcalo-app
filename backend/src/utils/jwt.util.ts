import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface JWTPayload {
  sub: string; // userId
  email: string;
  role: string;
  cityId: string;
  businessId?: string;
  type: 'access' | 'refresh';
}

export const generateAccessToken = (payload: Omit<JWTPayload, 'type'>): string => {
  return jwt.sign(
    { ...payload, type: 'access' },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiresIn as any }
  );
};

export const generateRefreshToken = (payload: Omit<JWTPayload, 'type' | 'email' | 'role' | 'cityId' | 'businessId'>): string => {
  return jwt.sign(
    { ...payload, type: 'refresh' },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn as any }
  );
};

export const verifyAccessToken = (token: string): JWTPayload => {
  try {
    const payload = jwt.verify(token, config.jwt.accessSecret) as JWTPayload;
    if (payload.type !== 'access') {
      throw new Error('Invalid token type');
    }
    return payload;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  try {
    const payload = jwt.verify(token, config.jwt.refreshSecret) as JWTPayload;
    if (payload.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    return payload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};
