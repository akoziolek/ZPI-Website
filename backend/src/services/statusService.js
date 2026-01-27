import prismaClient from "../lib/db.js";

/**
 * Find a status record by its status name.
 *
 * This is a thin helper around the Prisma client.
 *
 * @param {string} statusName - The status_name value to look up (e.g. 'Otwarty').
 * @returns {Promise<Object|null>} The status record or null if not found.
 */
export async function findStatus(statusName) {
    return await prismaClient.status.findUnique({ where: { status_name: statusName } });
}
