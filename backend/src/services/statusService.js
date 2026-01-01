import prisma from "../lib/db.js";

export async function findStatus(statusName) {
    return await prisma.status.findUnique({ where: { status_name: statusName } });
}
