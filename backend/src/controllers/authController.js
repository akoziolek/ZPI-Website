import {  loginUser, refreshSession } from "../services/authService.js";
import { updateUserLogin, formatUserResponse } from "../services/usersService.js";

/**
 * Controller: authenticate a user by email and set refresh cookie.
 *
 * Expects `req.body.mail`. On success sets a httpOnly cookie with the
 * refresh token and returns the access token and user data in JSON.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with tokens and user.
 */
export async function authenticateUser(req, res) {
    const { mail } = req.body;
    const { user, accessToken, refreshToken } = await loginUser(mail);
    
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        sameSite: isProduction ? 'None' : 'Lax', 
        secure: isProduction, 
        maxAge: 24 * 60 * 60 * 1000
    });
    
    await updateUserLogin(user.user_id); 

    res.json({
        success: true,
        token: accessToken,
        user: {
            uuid: user.uuid,
            name: user.name,
            surname: user.surname,
            mail: user.mail,
            role: user.role.role_name
        }
    });
}


/**
 * Controller: exchange refresh token (from cookie) for a new access token.
 *
 * Expects the refresh token cookie `jwt` to be present. If missing returns 401.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with new access token.
 */
export const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(401); // check if cookie exist
    const refreshToken = cookies.jwt;

    const accessToken = await refreshSession(refreshToken);
    res.json({
        success: true,
        token: accessToken
    });
    
};

/**
 * Controller: return basic info about the authenticated user.
 *
 * The authentication middleware must attach `req.user` before this handler.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with user data.
 */
export async function verifyToken(req, res) {
    // The authenticateToken middleware already verified the token
    // and attached the user to req.user
    const userData = formatUserResponse(req.user);
    
    res.json({
        success: true,
        user: userData
    });
}