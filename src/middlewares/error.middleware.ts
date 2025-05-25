import { Request, Response, NextFunction } from 'express';

import { logger } from '../helpers/customLogger';

interface ValidationErrorDetail {
  message: string;
}

interface ValidationError {
  errors: Record<string, ValidationErrorDetail>;
}

interface CustomError extends Error {
  statusCode?: number;
  type?: string;
  code?: number;
  keyValue?: Record<string, any>;
}

const globalErrorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  // Bad JSON request body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).send({
      status: 'error',
      message: 'Bad JSON request body',
      data: null,
    });
  }

  // Mongoose bad ObjectID
  if (err.name === 'CastError') {
    return res.status(400).send({
      status: 'error',
      message: 'Invalid resource ID',
      data: null,
    });
  }

  // Mongoose duplicate key value
  if (err.code === 11000) {
    const keyVal = Object.keys(err.keyValue ?? {})[0];
    return res.status(400).send({
      status: 'error',
      message: `${keyVal} already exists`,
      data: null,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const { errors } = err as unknown as ValidationError;
    const messageArr = Object.values(errors).map((value) => value.message);
    return res.status(400).send({
      status: 'error',
      message: `Invalid input data: ${messageArr.join(', ')}`,
      data: null,
    });
  }

  // Jwt invalid token error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).send({
      status: 'error',
      message: 'Invalid token. Please login again',
      data: null,
    });
  }

  // Jwt expired token error
  if (err.name === 'TokenExpiredError') {
    return res.status(401).send({
      status: 'error',
      message: 'Your token has expired. Please login again',
      data: null,
    });
  }

  // Log the errors we didn't handle
  logger.error(`[GlobalErrorHandler]: ${err.message}`);

  const statusCode = err.statusCode === 200 ? 500 : err.statusCode ?? 500;
  const message = `${statusCode}`.startsWith('4') ? err.message : 'Something went wrong';

  return res.status(statusCode).send({ status: 'error', message, data: null });
};

export { globalErrorHandler };
