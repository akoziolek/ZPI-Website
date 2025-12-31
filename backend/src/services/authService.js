import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
    return jwt.sign(
        { uuid: user.uuid, role: user.role.role_name, email: user.mail },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10min' }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        { uuid: user.uuid },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1h' }
    );
};
