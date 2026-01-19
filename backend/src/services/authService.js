import jwt from 'jsonwebtoken';
import { findUserByMail, findUserByUuid, updateUserLogin } from './usersService.js';
import { ForbiddenError, ValidationError, NotFoundError } from '../utils/errors.js';

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

export async function loginUser(mail) {
    if (!mail) throw new ValidationError("Mail is required");

    const user = await findUserByMail(mail);
    if (!user) throw new NotFoundError("User not found");

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await updateUserLogin(user.user_id);

    return { user, accessToken, refreshToken };
}

export async function refreshSession(refreshToken) {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    const user = await findUserByUuid(decoded.uuid); 
    if (!user) throw new ForbiddenError();

    const accessToken = generateAccessToken(user);
    return accessToken;
}