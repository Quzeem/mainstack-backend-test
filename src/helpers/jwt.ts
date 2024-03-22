import jwt from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
}

export const generateJwtToken = (payload: JwtPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRES_IN });
};
