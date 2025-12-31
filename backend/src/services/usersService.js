import prisma from "../lib/db.js";

function mapUser(user) {
    return {
       uuid: user.uuid,
        name: user.name,
        surname: user.surname,
        mail: user.mail,
        role: user.role.role_name
    };
}

export const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        select: {
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

export const updateUserLogin = async (userId) => {
    await prisma.user.update({
        where: { user_id: userId },
        data: { last_login: new Date() }
    });
};

export const findUserByMail = async (userMail) => {
    const user = await prisma.user.findUnique({
        where: { mail: userMail },
        include: { role: true }
    });
    return user;
};

export const findUserByUuid = async (userUuid) => {
    const user = await prisma.user.findUnique({
        where: { uuid: userUuid},
        include: { role: true }
    });
    return user;
};