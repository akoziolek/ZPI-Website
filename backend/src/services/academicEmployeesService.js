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

/**
 * Fetch all academic employees and map them to a lightweight DTO used by the API.
 *
 * The DTO contains public user information and academic title data. This function
 * queries the database for academic employees and returns the mapped array.
 *
 * @returns {Promise<Array<Object>>} Array of academic employee DTOs.
 */
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

/**
 * Fetch a single academic employee by the user's UUID and map to a DTO.
 *
 * @param {string} uuid - The UUID of the user linked to the academic employee.
 * @throws {NotFoundError} When the employee is not found.
 * @returns {Promise<Object>} Academic employee DTO.
 */
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