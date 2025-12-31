import jwt from 'jsonwebtoken';
import prisma from '../lib/db.js';

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required' });
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await prisma.user.findUnique({
            where: { 
                uuid: decoded.uuid
            },
            include: { role: true }
        });

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ 
                success: false, 
                message: 'Token expired', 
            });
        }
         return res.status(403).json({ success: false, message: 'Invalid token' });
    }
};

export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        if (!allowedRoles.includes(req.user.role.role_name)) {
            return res.status(403).json({ success: false, message: 'Insufficient permissions' });
        }

        next();
    };
};