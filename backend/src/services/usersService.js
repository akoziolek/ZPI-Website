import prisma from "../lib/db.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from "../utils/errors.js";

function mapUser(user) {
    return {
        id: user.uuid,
        name: user.name,
        surname: user.surname,
        email: user.mail,
        role: user.role.role_name
    };
}

export const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        select: {
            user_id: true,
            uuid: true,
            name: true,
            surname: true,
            mail: true,
            role: {
                select: {
                    role_name: true
                }
            }
        }
    });
    return users.map(mapUser);
};

export const authenticateUser = async (mail, password) => {
    const user = await prisma.user.findUnique({
        where: { mail },
        include: { role: true }
    });

    if (!user) {
        throw new AuthenticationError("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw new AuthenticationError("Invalid credentials");
    }

    return user;
};

export const generateToken = (user) => {
    return jwt.sign(
        { userId: user.user_id, uuid: user.uuid },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

