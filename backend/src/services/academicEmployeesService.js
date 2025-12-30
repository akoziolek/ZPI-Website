import prisma from "../lib/db.js";
import { NotFoundError } from "../utils/errors.js";

function mapAcademicEmployeeToDto(academicEmployee) {
    return {
        id: academicEmployee.user.uuid,
        name: academicEmployee.user.name,
        surname: academicEmployee.user.surname,
        mail: academicEmployee.user.mail,
    };
}

export async function getAllAcademicEmployees() {
    const employees = await prisma.academicEmployee.findMany({
        include: {
            user: {
                select: {
                    uuid: true,
                    name: true,
                    surname: true,
                    mail: true,
                },
            },
        },
    });
    return employees.map(mapAcademicEmployeeToDto);
}

export async function getAcademicEmployee(uuid) {
    const employee = await prisma.academicEmployee.findFirst({
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