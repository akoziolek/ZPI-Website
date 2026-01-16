import prismaClient from "../lib/db.js";

export async function findStatus(statusName) {
    return await prismaClient.status.findUnique({ where: { status_name: statusName } });
}
