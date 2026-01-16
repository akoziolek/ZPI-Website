import prismaClient from "../lib/db.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";
import { STATUSES } from "../config.js";
import { findStatus } from "./statusService.js";
import { updateStatus } from "./topicsService.js";

async function createOpinion(argumentation, userId, topicId) {
    await prismaClient.opinion.create({
        data: {
            argumentation,
            employee_id: userId,
            topic_id: topicId
        }
    });
}


export async function addOpinion(topicUuid, argumentation, isPositive, userId) {
    const topic = await prismaClient.topic.findUnique({
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
    const newStatus = isPositive == true ? STATUSES.APPROVED : STATUSES.REJECTED
    const rejectedStatus = await findStatus(newStatus);
    if (rejectedStatus) {
        await updateStatus(topicUuid, rejectedStatus.status_id);
    }
}