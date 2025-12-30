import prisma from "../lib/db.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";
import { STATUSES } from "../config.js";

export async function approveTopic(topicUuid, argumentation, userId) {
    const topic = await prisma.topic.findUnique({
        where: { uuid: topicUuid },
        include: { status: true }
    });

    if (!topic) {
        throw new NotFoundError("Topic not found");
    }

    if (topic.status.status_name !== STATUSES.SUBMITTED) {
        throw new ValidationError("Topic must be in 'Złożony' status to be approved");
    }

    // Assume user is KPK member, TODO: check role - enable middleware

    // Create opinion
    await prisma.opinion.create({
        data: {
            argumentation,
            employee_id: userId,
            topic_id: topic.topic_id
        }
    });

    // Update status to approved
    const approvedStatus = await prisma.status.findUnique({ where: { status_name: STATUSES.APPROVED } });
    if (approvedStatus) {
        await prisma.topic.update({
            where: { uuid: topicUuid },
            data: { status_id: approvedStatus.status_id }
        });
    }
}

export async function rejectTopic(topicUuid, argumentation, userId) {
    const topic = await prisma.topic.findUnique({
        where: { uuid: topicUuid },
        include: { status: true }
    });

    if (!topic) {
        throw new NotFoundError("Topic not found");
    }

    if (topic.status.status_name !== STATUSES.SUBMITTED) {
        throw new ValidationError("Topic must be in 'Złożony' status to be rejected");
    }

    // Create opinion
    await prisma.opinion.create({
        data: {
            argumentation,
            employee_id: userId,
            topic_id: topic.topic_id
        }
    });

    // Update status to rejected
    const rejectedStatus = await prisma.status.findUnique({ where: { status_name: STATUSES.REJECTED } });
    if (rejectedStatus) {
        await prisma.topic.update({
            where: { uuid: topicUuid },
            data: { status_id: rejectedStatus.status_id }
        });
    }
}