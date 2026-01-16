import prismaClient from "../lib/db.js";
import { NotFoundError } from "../utils/errors.js";

function mapAcademicEmployeeToDto(academicEmployee) {
    return {
        uuid: academicEmployee.user.uuid,
        name: academicEmployee.user.name,
        surname: academicEmployee.user.surname,
        mail: academicEmployee.user.mail,
        full_academic_title: academicEmployee.academic_tile.full_name,
        shortcut_academic_title: academicEmployee.academic_tile.shortcut_title
    };
}

export async function getAllAcademicEmployees() {
    const employees = await prismaClient.academicEmployee.findMany({
        include: {
            user: {
                select: {
                    uuid: true,
                    name: true,
                    surname: true,
                    mail: true,
                },
            },
            academic_tile: {
                select: {
                    full_name: true,
                    shortcut: true
                }
            }
        },
    });
    return employees.map(mapAcademicEmployeeToDto);
}

export async function getAcademicEmployee(uuid) {
    const employee = await prismaClient.academicEmployee.findUnique({
        where: {
            user: {
                uuid: uuid
            }
        },
        include: {
            user: {
                select: {
                    uuid: true,
                    name: true,
                    surname: true,
                    mail: true,
                },
            },
            academic_tile: {
                select: {
                    full_name: true,
                    shortcut: true
                }
            },
            topics: {
                include: {
                    status: true
                }
            }
        }
    });

    if (!employee) {
        throw new NotFoundError("Academic Employee");
    }

    return mapAcademicEmployeeToDto(employee);
}