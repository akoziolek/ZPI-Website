import prismaClient from "../lib/db.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";
import { STATUSES } from "../config.js";
import { findStatus } from "./statusService.js";
import { updateStatus } from "./topicsService.js";

/**
 * Add an opinion for a topic and update the topic status according to the opinion.
 *
 * Validates that the topic exists and is in the 'SUBMITTED' status, then
 * creates an opinion record and updates the topic status to APPROVED or REJECTED
 * based on the `isPositive` flag.
 *
 * @param {string} topicUuid - UUID of the topic to add an opinion for.
 * @param {string} argumentation - The textual argumentation for the opinion.
 * @param {boolean} isPositive - True for positive opinion, false for negative.
 * @param {number} userId - Internal database id of the employee creating the opinion.
 * @throws {NotFoundError} When the topic is not found.
 * @throws {ValidationError} When the topic is not in the 'SUBMITTED' status.
 * @returns {Promise<void>} Resolves when the opinion is created and status is updated.
 */
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