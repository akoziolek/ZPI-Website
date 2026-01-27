import prismaClient from "../lib/db.js";
import { NotFoundError } from "../utils/errors.js";

function mapStudentToDto(student) {
    return {
       uuid: student.user.uuid,
        name: student.user.name,
        surname: student.user.surname,
        mail: student.user.mail,
        indexNumber: student.index,
        ects: student.ects_deficit
    };
}

/**
 * Return all students mapped to a public DTO.
 *
 * Each DTO includes basic user information, index number and ECTS deficit.
 * @returns {Promise<Array<Object>>} Array of student DTOs.
 */
export async function getAllStudents() {
    const students = await prismaClient.student.findMany({
        select: {
            index: true,
            ects_deficit: true,
            user: {
                select: {
                    uuid: true,
                    name: true,
                    surname: true,
                    mail: true
                }
            }
        }
    });

    return students.map(mapStudentToDto);
}

/**
 * Get a single student by the user's UUID and map to a DTO.
 *
 * @param {string} userUuid - UUID of the user to fetch as a student.
 * @throws {NotFoundError} When the student is not found.
 * @returns {Promise<Object>} Student DTO.
 */
export async function getStudent(userUuid) {
    const student = await prismaClient.student.findUnique({
        where: {
            user: { uuid: userUuid }
        },
        select: {
            index: true,
            ects_deficit: true,
            user: {
                select: {
                    uuid: true,
                    name: true,
                    surname: true,
                    mail: true
                }
            }
        }
    });

    if (!student) {
        throw new NotFoundError("Student");
    }

    return mapStudentToDto(student);
}


/**
 * Check whether a student (identified by user UUID) currently has a topic assigned.
 *
 * @param {string} userUuid - The UUID of the user to check.
 * @returns {Promise<boolean>} True if the student has a topic, otherwise false.
 */
export async function checkIfStudentHasTopic(userUuid) {
    const count = await prismaClient.student.count({
        where: {
            user: { uuid: userUuid },
            topic_id: { not: null }
        }
    });

    return count > 0;
}
