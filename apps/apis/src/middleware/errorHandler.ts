import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ApiError } from '../utils/apiError';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors).map((e: any) => e.message).join(', ');
  }

  // Handle Mongoose bad ObjectId
  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Handle duplicate key error
  if (err.code && err.code === 11000) {
    statusCode = 409;
    message = `Duplicate key error: ${JSON.stringify(err.keyValue)}`;
  }

  // Handle custom ApiError
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || undefined,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
}
