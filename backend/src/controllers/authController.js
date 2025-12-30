import prisma from "../lib/db.js";
import { generateToken, updateUserLogin, findUserByMail } from "../services/usersService.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";

export async function authenticateUser(req, res) {
    try {
        const { mail } = req.body;

        if (!mail) throw new ValidationError("Mail is required");
    
        const user = await findUserByMail(mail);
        
        if (!user) throw new NotFoundError("User not found");
        
        const token = generateToken(user);
        await updateUserLogin(user.user_id); // id na backendzie, jest ok

        res.json({
            success: true,
            token,
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