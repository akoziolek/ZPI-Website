import prisma from "../lib/db.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";
import { STATUSES } from "../config.js";
import { findStatus } from "./statusService.js";
import { updateStatus } from "./topicsService.js";

async function createOpinion(argumentation, userId, topicId) {
    await prisma.opinion.create({
        data: {
            argumentation,
            employee_id: userId,
            topic_id: topicId
        }
    });
}

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
    // ROLE checked in middleware
    createOpinion(argumentation, userId, topic.topic_id);
    
    // Update status to approved
    const approvedStatus = await findStatus(STATUSES.APPROVED);
    if (approvedStatus) {
        await updateStatus(topicUuid, approvedStatus.status_id);
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
    createOpinion(argumentation, userId, topic.topic_id);

    // Update status to rejected
    const rejectedStatus = await findStatus(STATUSES.REJECTED);
    if (rejectedStatus) {
        await updateStatus(topicUuid, rejectedStatus.status_id);
    }
}