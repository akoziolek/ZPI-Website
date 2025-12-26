import prisma from "../lib/db.js";
import jwt from 'jsonwebtoken';


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


export const generateToken = (user) => {
    return jwt.sign(
        { userId: user.user_id, uuid: user.uuid },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

export const updateUserLogin = async (userId) => {
    await prisma.user.update({
        where: { user_id: userId },
        data: { last_login: new Date() }
    });
};

