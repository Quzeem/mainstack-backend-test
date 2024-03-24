import { Request, Response, NextFunction } from 'express';
import httpError from 'http-errors';
import jwt from 'jsonwebtoken';

import { User } from '../models/user.model';
import { JwtPayload } from '../helpers/jwt';

export const extractTokenFromHeader = (request: Request): string | undefined => {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};

/** A middleware to protect routes from unauthenticated users */
export const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  // Get token from authorization header
  const token = extractTokenFromHeader(req);

  if (!token) {
    throw new httpError.Unauthorized('You are not logged in. Please login to gain access');
  }

  // Verify token
  const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

  // Check if the user still exists
  const currentUser = await User.findById(payload.userId);
  if (!currentUser) {
    throw new httpError.Unauthorized('The user assigned this token does no longer exist');
  }

  // Set the user property on the request object
  req.user = currentUser;

  next();
};
