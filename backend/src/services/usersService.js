import prismaClient from "../lib/db.js";

function mapUser(user) {
    return {
       uuid: user.uuid,
        name: user.name,
        surname: user.surname,
        mail: user.mail,
        role: user.role.role_name
    };
}

/**
 * Fetch all users and map them to a public DTO containing role information.
 *
 * @returns {Promise<Array<Object>>} Array of user DTOs.
 */
export const getAllUsers = async () => {
    const users = await prismaClient.user.findMany({
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

/**
 * Update the last_login timestamp for a user (internal id) when they authenticate.
 *
 * @param {number} userId - Internal database id of the user.
 * @returns {Promise<void>} Resolves when the update completes.
 */
export const updateUserLogin = async (userId) => {
    await prismaClient.user.update({
        where: { user_id: userId },
        data: { last_login: new Date() }
    });
};

/**
 * Find a user by their email address.
 *
 * @param {string} userMail - The user's email to search for.
 * @returns {Promise<Object|null>} User record including role or null when not found.
 */
export const findUserByMail = async (userMail) => {
    const user = await prismaClient.user.findUnique({
        where: { mail: userMail },
        include: { role: true }
    });
    return user;
};

/**
 * Find a user by their UUID.
 *
 * @param {string} userUuid - The UUID of the user to fetch.
 * @returns {Promise<Object|null>} User record including role or null when not found.
 */
export const findUserByUuid = async (userUuid) => {
    const user = await prismaClient.user.findUnique({
        where: { uuid: userUuid},
        include: { role: true }
    });
    return user;
};

/**
 * Format an internal user record to the response shape used by controllers.
 *
 * This normalizes different role representations and returns only public fields.
 *
 * @param {Object} user - Internal user record (Prisma or already formatted).
 * @returns {Object} Formatted user response.
 */
export function formatUserResponse(user) {
    return {
        uuid: user.uuid,
        name: user.name,
        surname: user.surname,
        mail: user.mail,
        role: user.role?.role_name || user.role // obsługa różnych formatów roli
    };
}