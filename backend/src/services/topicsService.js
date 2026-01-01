import prisma from "../lib/db.js";
import {
    NotFoundError,
} from "../utils/errors.js";

export function mapTopicToDto(topic) {
    return {
       uuid: topic.uuid,
        name: topic.name,
        description: topic.description,
        status_name: topic.status.status_name, // status_id ??

        supervisor: topic.employee ? {
           uuid: topic.employee.user.uuid,
            name: topic.employee.user.name,
            surname: topic.employee.user.surname,
        } : null,

        students: topic.students.map(student => ({
           uuid: student.user.uuid,
            index: student.index,
            name: student.user.name,
            surname: student.user.surname,
        })),

        opinion: topic.opinion ? {
            argumentation: topic.opinion.argumentation,
            author: {
               uuid: topic.opinion.employee.user.uuid,
                name: topic.opinion.employee.user.name,
                surname: topic.opinion.employee.user.surname
            },
        } : null
    };
}

export const getAllTopics = async (search) => {
    const topics = await prisma.topic.findMany({
        where: search ? {
            name: { contains: search, mode: 'insensitive' }
        } : {},
        include: {
            status: true,
            employee: { include: { user: true } },
            students: { include: { user: true } }
        }
    });
    return topics.map(mapTopicToDto);
};

export const getTopicByUuid = async (topicUuid) => {
    const topic = await prisma.topic.findUnique({
        where: { uuid: topicUuid },
        include: {
            status: true,
            employee: { include: { user: true } },
            students: { include: { user: true } },
            opinion: { include: { employee: { include: { user: true } } } }
        }
    });

    if (!topic) {
        throw new NotFoundError('Topic');
    }

    return mapTopicToDto(topic);
};

export const getStatusByName = async (statusName) => {
    return await prisma.status.findUnique({ where: { status_name: statusName } });
};

export const updateStatus = async (topicId, newStatusId) => {
    await prisma.topic.update({
        where: { uuid: topicId },
        data: { status_id: newStatusId }
    });
}