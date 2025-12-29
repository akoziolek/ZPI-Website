import { 
    getAllStudents, 
    getStudent,
    checkIfStudentHasTopic
} from "../services/studentsService.js";

export async function getAllStudentsController(req, res) {
    const students = await getAllStudents();
    res.json({ success: true, data: students });
}

export async function getStudentController(req, res) {
    const { userUuid } = req.params;

    const student = await getStudent(userUuid);
    res.json({ success: true, data: student });
}

export async function getStudentAssignmentController(req, res) {
    const { userUuid } = req.params;

    const hasTopic = await checkIfStudentHasTopic(userUuid);
    res.json({ success: true, data: hasTopic });
}