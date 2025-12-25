import { AppError, ValidationError } from '../utils/errors.js';

export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // custom AppError instances
    if (err instanceof AppError) {
        const statusCode = err.statusCode || 500;
        const response = {
            success: false,
            message: err.message,
            ...(err instanceof ValidationError && { errors: err.errors }),
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        };

        return res.status(statusCode).json(response);
    }

    // Prisma errors
    if (err.code) {
        switch (err.code) {
            case 'P2002':
                return res.status(409).json({
                    success: false,
                    message: 'Unique constraint violation - resource already exists',
                    error: err.message,
                    ...(process.env.NODE_ENV === 'development' && { details: err.meta })
                });
            case 'P2025':
                return res.status(404).json({
                    success: false,
                    message: 'Record not found',
                    error: err.message
                });
            case 'P2003':
                return res.status(400).json({
                    success: false,
                    message: 'Foreign key constraint violation',
                    error: err.message
                });
            default:
                return res.status(500).json({
                    success: false,
                    message: 'Database error',
                    error: err.message,
                    ...(process.env.NODE_ENV === 'development' && { code: err.code })
                });
        }
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid authentication token'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Authentication token has expired'
        });
    }

    // Zod validation errors
    if (err.name === 'ZodError') {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: err.errors.map(error => ({
                field: error.path.join('.'),
                message: error.message,
                code: error.code
            }))
        });
    }

    // Default error
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};