import {  loginUser, refreshSession } from "../services/authService.js";
import { updateUserLogin, formatUserResponse } from "../services/usersService.js";

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

    await updateUserLogin(user.user_id); // id na backendzie, jest ok

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

// who am i, after authentication
export async function verifyToken(req, res) {
    // The authenticateToken middleware already verified the token
    // and attached the user to req.user
    const userData = formatUserResponse(req.user);
    
    res.json({
        success: true,
        user: userData
    });
}