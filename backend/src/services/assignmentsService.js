import prismaClient from "../lib/db.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";
import { STATUSES, MAX_TOPIC_CAPACITY } from "../config.js";

async function join(userId, topicId) {
    await prismaClient.student.update({
        where: { user_id: userId },
        data: {
            topic: {
                connect: { topic_id: topicId }
            }
        }
    });
}

async function withdraw(userId) {
    await prismaClient.student.update({
        where: { user_id: userId },
        data: {
            topic: { disconnect: true }
        }
    });
}

/**
 * Join a topic by its UUID for a given user.
 *
 * Validates that the topic exists, is in an open status, and that the
 * maximum student capacity hasn't been reached. On success the student's
 * record is updated to reference the topic.
 *
 * @param {string} topicUuid - The UUID of the topic to join.
 * @param {number} userId - The internal database id of the user (student).
 * @throws {NotFoundError} If the topic does not exist.
 * @throws {ValidationError} If the topic status is not open or the student limit is reached.
 * @returns {Promise<void>} Resolves when the join operation completes.
 */
export async function joinTopic(topicUuid, userId) {
    const topic = await prismaClient.topic.findUnique({
        where: { uuid: topicUuid },
        include: { 
            status: true, 
            students: true,
        }
    });

    if (!topic) {
        throw new NotFoundError("Topic not found");
    }

    if (topic.status.status_name !== STATUSES.OPEN) {
        throw new ValidationError("Topic must be in 'Otwarty' status to be joined");
    }

    const student = await prismaClient.student.findUnique({
        where: { user_id: userId },
    });
    
    if (student.topic_id != null) {
        throw new ValidationError("Student must not be assigned to join a topic");
    }

    const studentCount = topic.students.length
    if (studentCount >= MAX_TOPIC_CAPACITY) {
        throw new ValidationError("STUDENTS_LIMIT_REACHED")
    }

    await join(userId, topic.topic_id);
}

/**
 * Withdraw a student from a topic by topic UUID.
 *
 * Validates that the topic exists and is in an open status, then
 * removes the topic relation from the student's record.
 *
 * @param {string} topicUuid - The UUID of the topic to withdraw from.
 * @param {number} userId - The internal database id of the user (student).
 * @throws {NotFoundError} If the topic does not exist.
 * @throws {ValidationError} If the topic status is not open.
 * @returns {Promise<void>} Resolves when the withdraw operation completes.
 */
export async function withdrawTopic(topicUuid, userId) {
    const topic = await prismaClient.topic.findUnique({
        where: { uuid: topicUuid },
        include: { 
            status: true,
            students: true,
        }
    });

    if (!topic) {
        throw new NotFoundError("Topic not found");
    }

    if (topic.status.status_name !== STATUSES.OPEN) {
        throw new ValidationError("Topic must be in 'Otwarty' status to be joined");
    }

    const assignedStudent = topic.students.some((student) => student.user_id === userId)

    if (!assignedStudent) {
        throw new ValidationError("Student must be assigned to topic to withdraw from it");
    }

    await withdraw(userId);
}