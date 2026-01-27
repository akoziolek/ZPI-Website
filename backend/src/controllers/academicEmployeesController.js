import { 
    getAllAcademicEmployees, 
    getAcademicEmployee
} from "../services/academicEmployeesService.js";

/**
 * Controller: return all academic employees.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with employees data.
 */
export async function getAllAcademicEmployeesController(req, res) {
    const employees = await getAllAcademicEmployees();
    res.json({ success: true, data: employees });
}

/**
 * Controller: return a single academic employee by user UUID.
 *
 * Expects `req.params.uuid`.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with employee data.
 */
export async function getAcademicEmployeeController(req, res) {
    const { uuid } = req.params;

    const employee = await getAcademicEmployee(uuid);
    res.json({ success: true, data: employee });
}