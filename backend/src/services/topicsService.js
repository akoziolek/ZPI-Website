import prismaClient from "../lib/db.js";
import {
    NotFoundError,
} from "../utils/errors.js";

/**
 * Map a full topic entity from the database into a public DTO used by the API.
 *
 * The DTO intentionally flattens nested relations (student/user/employee/opinion)
 * into an easy-to-consume shape for the frontend.
 *
 * @param {Object} topic - Topic record returned by Prisma with includes.
 * @returns {Object} The topic DTO.
 */
export function mapTopicToDto(topic) {
    return {
       uuid: topic.uuid,
        name: topic.name,
        description: topic.description,
        status_name: topic.status.status_name, 

        supervisor: topic.employee ? {
            uuid: topic.employee.user.uuid,
            name: topic.employee.user.name,
            surname: topic.employee.user.surname,
            full_academic_title: topic.employee.academic_title?.full_name,
            shortcut_academic_title: topic.employee.academic_title?.shortcut,
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

/** 
 * Fetch all topics, optionally filtered by a search string.
 *
 * @param {string=} search - Optional case-insensitive substring to filter topic names.
 * @returns {Promise<Array<Object>>} Array of topic DTOs.
 */
export const getAllTopics = async (search) => {
    const topics = await prismaClient.topic.findMany({
        where: search ? {
            name: { contains: search, mode: 'insensitive' }
        } : {},
        include: {
            status: true,
            employee: { include: { user: true, academic_title: true } },
            students: { include: { user: true } }
        }
    });
    return topics.map(mapTopicToDto);
};

/**
 * Fetch a single topic by UUID and return the mapped DTO.
 *
 * @param {string} topicUuid - UUID of the topic to fetch.
 * @throws {NotFoundError} When the topic doesn't exist.
 * @returns {Promise<Object>} Topic DTO.
 */
export const getTopicByUuid = async (topicUuid) => {
    const topic = await prismaClient.topic.findUnique({
        where: { uuid: topicUuid },
        include: {
            status: true,
            employee: { include: { user: true, academic_title: true } },
            students: { include: { user: true } },
            opinion: { include: { employee: { include: { user: true } } } }
        }
    });

    if (!topic) {
        throw new NotFoundError('Topic');
    }

    return mapTopicToDto(topic);
};

/**
 * Update the status of a topic by its UUID.
 *
 * @param {string} topicId - UUID of the topic to update.
 * @param {number} newStatusId - Internal status id to set on the topic.
 * @returns {Promise<void>} Resolves when the update completes.
 */
export const updateStatus = async (topicId, newStatusId) => {
    await prismaClient.topic.update({
        where: { uuid: topicId },
        data: { status_id: newStatusId }
    });
}
