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

export async function joinTopic(topicUuid, userId) {
    const topic = await prismaClient.topic.findUnique({
        where: { uuid: topicUuid },
        include: { status: true, _count: { select: { students: true } } }
    });

    if (!topic) {
        throw new NotFoundError("TOPIC_NOT_FOUND");
    }

    if (topic.status.status_name !== STATUSES.OPEN) {
        throw new ValidationError("TOPIC_NOT_OPEN");
    }

    if (topic._count.students >= MAX_TOPIC_CAPACITY) {
        throw new ValidationError("STUDENTS_LIMIT_REACHED")
    }

    await join(userId, topic.topic_id);
}

export async function withdrawTopic(topicUuid, userId) {
    const topic = await prismaClient.topic.findUnique({
        where: { uuid: topicUuid },
        include: { status: true }
    });

    if (!topic) {
        throw new NotFoundError("TOPIC_NOT_FOUND");
    }

    if (topic.status.status_name !== STATUSES.OPEN) {
        throw new ValidationError("TOPIC_NOT_OPEN");
    }

    await withdraw(userId);
}