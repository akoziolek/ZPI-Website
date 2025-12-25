import { 
    getAllStudents, 
    getStudent 
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