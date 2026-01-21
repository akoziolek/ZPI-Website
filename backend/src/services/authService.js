import jwt from 'jsonwebtoken';
import { findUserByMail, findUserByUuid, updateUserLogin } from './usersService.js';
import { ForbiddenError, ValidationError, NotFoundError } from '../utils/errors.js';

/**
 * Generate a short-lived access token for a user.
 *
 * The token payload contains uuid, role and email and is signed with
 * the ACCESS_TOKEN_SECRET environment variable.
 *
 * @param {Object} user - User object (must include uuid, mail and role.role_name).
 * @returns {string} Signed JWT access token.
 */
export const generateAccessToken = (user) => {
    return jwt.sign(
        { uuid: user.uuid, role: user.role.role_name, email: user.mail },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10min' }
    );
};

/**
 * Generate a refresh token used to obtain new access tokens.
 *
 * The refresh token is short-lived and only contains the user's uuid.
 *
 * @param {Object} user - User object (must include uuid).
 * @returns {string} Signed JWT refresh token.
 */
export const generateRefreshToken = (user) => {
    return jwt.sign(
        { uuid: user.uuid },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1h' }
    );
};

/**
 * Authenticate a user by email and return access/refresh tokens.
 *
 * This function looks up the user by email, throws if not found, generates
 * JWT tokens and updates the user's last_login timestamp.
 *
 * @param {string} mail - Email address used for login.
 * @throws {ValidationError} When mail is not provided.
 * @throws {NotFoundError} When the user with the given email does not exist.
 * @returns {Promise<{user: Object, accessToken: string, refreshToken: string}>}
 */
export async function loginUser(mail) {
    if (!mail) throw new ValidationError("Mail is required");

    const user = await findUserByMail(mail);
    if (!user) throw new NotFoundError("User not found");

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await updateUserLogin(user.user_id);

    return { user, accessToken, refreshToken };
}

/**
 * Refresh an access token using a valid refresh token.
 *
 * Verifies the supplied refresh token and returns a newly signed access token.
 * @param {string} refreshToken - The refresh token string from the cookie.
 * @throws {ForbiddenError} When the refresh token is invalid or user not found.
 * @returns {Promise<string>} Newly issued access token.
 */
export async function refreshSession(refreshToken) {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    const user = await findUserByUuid(decoded.uuid); 
    if (!user) throw new ForbiddenError();

    const accessToken = generateAccessToken(user);
    return accessToken;
}