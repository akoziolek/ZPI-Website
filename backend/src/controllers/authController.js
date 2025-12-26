import prisma from "../lib/db.js";
import { generateToken, updateUserLogin } from "../services/usersService.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";

export async function authenticateUser(req, res) {
    try {
        const { mail } = req.body;

        if (!mail) {
            throw new ValidationError("Email is required");
        }

        // Find user by email only (no password check)
        const user = await prisma.user.findUnique({
            where: { mail },
            include: { role: true }
        });

        if (!user) {
            throw new NotFoundError("User not found");
        }

        // Generate JWT token
        const token = generateToken(user);

        // Update last login
        await updateUserLogin(user.user_id);

        res.json({
            success: true,
            token,
            user: {
                user_id: user.user_id,
                uuid: user.uuid,
                name: user.name,
                surname: user.surname,
                mail: user.mail,
                role: user.role
            }
        });

    } catch (error) {
        throw error;
    }
}