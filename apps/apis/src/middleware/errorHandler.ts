import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ApiError } from '../utils/apiError';


export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let errors = undefined;

    // Handle Mongoose validation errors
    if (err instanceof mongoose.Error.ValidationError) {
        statusCode = 400;
        message = Object.values(err.errors).map((e: any) => e.message).join(', ');
        errors = err.errors;
    }
    // Handle Mongoose bad ObjectId
    else if (err instanceof mongoose.Error.CastError) {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }
    // Handle duplicate key error
    else if (err.code && err.code === 11000) {
        statusCode = 409;
        message = `Duplicate key error: ${JSON.stringify(err.keyValue)}`;
    }
    // Handle custom ApiError
    else if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        errors = err.errors;
    }
    // Handle generic JS errors
    else if (err instanceof Error) {
        message = err.message;
    }
    // Truly unknown error
    else {
        message = typeof err === 'string' ? err : 'Unknown error occurred';
    }

    // Log the error (always log uncaught errors)
    if (statusCode === 500) {
        // eslint-disable-next-line no-console
        console.error('Uncaught error:', err);
    }

    res.status(statusCode).json({
        success: false,
        message,
        errors,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
}
