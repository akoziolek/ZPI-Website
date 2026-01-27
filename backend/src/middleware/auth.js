import jwt from 'jsonwebtoken';
import { findUserByUuid } from '../services/usersService.js';
import { AuthenticationError, ForbiddenError } from '../utils/errors.js';

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) throw new AuthenticationError('Access token required');

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        const user = await findUserByUuid(decoded.uuid);
        if (!user) throw new AuthenticationError('User not found');

        req.user = user;
        next();
    } catch (error) {
        next(error); 
    }
};

export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) return next(new AuthenticationError());

        if (!allowedRoles.includes(req.user.role.role_name)) {
            return next(new ForbiddenError('Insufficient permissions'));
        }

        next();
    };
};