import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export interface CityFilterRequest extends AuthRequest {
  cityFilter?: {
    cityId: string;
  };
}

export const cityFilter = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authReq = req as CityFilterRequest;

  if (authReq.user?.cityId) {
    authReq.cityFilter = {
      cityId: authReq.user.cityId,
    };
  }

  next();
};
