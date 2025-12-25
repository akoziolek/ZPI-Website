import { 
    getAllAcademicEmployees, 
    getAcademicEmployee
} from "../services/academicEmployeesService.js";

export async function getAllAcademicEmployeesController(req, res) {
    const employees = await getAllAcademicEmployees();
    res.json({ success: true, data: employees });
}

export async function getAcademicEmployeeController(req, res) {
    const { uuid } = req.params;

    const employee = await getAcademicEmployee(uuid);
    res.json({ success: true, data: employee });
}