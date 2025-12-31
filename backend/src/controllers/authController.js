import { generateAccessToken, generateRefreshToken } from "../services/authService.js";
import { updateUserLogin, findUserByMail, findUserByUuid } from "../services/usersService.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";
import jwt from "jsonwebtoken";

export async function authenticateUser(req, res) {
    try {
        const { mail } = req.body;

        if (!mail) throw new ValidationError("Mail is required");
    
        const user = await findUserByMail(mail);
        
        if (!user) throw new NotFoundError("User not found");
        
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
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

    } catch (error) {
        throw error;
    }
}


export const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(401); // check if cookie exist
    const refreshToken = cookies.jwt;

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        const user = await findUserByUuid(decoded.uuid); 
        if (!user) return res.sendStatus(403);
        
        const accessToken = generateAccessToken(user); // generate new access token

        res.json({
            success: true,
            token: accessToken
        });
    } catch (error) {
        console.error(error);
        return res.sendStatus(403); // refresh token has expired
    }
};

// who am i, after authentication
export async function verifyToken(req, res) {
    // The authenticateToken middleware already verified the token
    // and attached the user to req.user
    res.json({
        success: true,
        user: {
            uuid: req.user.uuid,
            name: req.user.name,
            surname: req.user.surname,
            mail: req.user.mail,
            role: req.user.role.role_name
        }
    });
}