import { 
    getAllStudents, 
    getStudent,
    checkIfStudentHasTopic
} from "../services/studentsService.js";

/**
 * Controller: return all students.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with students data.
 */
export async function getAllStudentsController(req, res) {
    const students = await getAllStudents();
    res.json({ success: true, data: students });
}

/**
 * Controller: return a single student by user UUID.
 *
 * Expects `req.params.userUuid` with the student's user UUID.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with student data.
 */
export async function getStudentController(req, res) {
    const { userUuid } = req.params;

    const student = await getStudent(userUuid);
    res.json({ success: true, data: student });
}

/**
 * Controller: check whether the given student has an assigned topic.
 *
 * Expects `req.params.userUuid` and returns a boolean in the `data` field.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with boolean result.
 */
export async function getStudentAssignmentController(req, res) {
    const { userUuid } = req.params;

    const hasTopic = await checkIfStudentHasTopic(userUuid);
    res.json({ success: true, data: hasTopic });
}