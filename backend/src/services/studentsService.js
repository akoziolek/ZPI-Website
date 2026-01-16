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


export async function checkIfStudentHasTopic(userUuid) {
    const count = await prismaClient.student.count({
        where: {
            user: { uuid: userUuid },
            topic_id: { not: null }
        }
    });

    return count > 0;
}
