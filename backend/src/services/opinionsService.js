import prismaClient from "../lib/db.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";
import { STATUSES } from "../config.js";
import { findStatus } from "./statusService.js";
import { updateStatus } from "./topicsService.js";

export async function addOpinion(topicUuid, argumentation, isPositive, userId) {
    const topic = await prismaClient.topic.findUnique({
        where: { uuid: topicUuid },
        include: { status: true }
    });

    if (!topic) {
        throw new NotFoundError("Topic not found");
    }

    if (topic.status.status_name !== STATUSES.SUBMITTED) {
        throw new ValidationError("Topic must be in 'Złożony' status to add an opinion");
    }

    await prismaClient.opinion.create({
        data: {
            argumentation,
            employee_id: userId,
            topic_id: topic.topic_id
        }
    });

    const newStatus = isPositive == true ? STATUSES.APPROVED : STATUSES.REJECTED;
    const newStatusDb = await findStatus(newStatus);
    if (newStatusDb) {
        await updateStatus(topicUuid, newStatusDb.status_id);
    }
}