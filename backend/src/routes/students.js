import { Router } from "express"
import { getAllStudentsController, getStudentController, getStudentAssignmentController } from "../controllers/studentsController.js"

const studentRoutes = Router()

studentRoutes.get("/", getAllStudentsController);
studentRoutes.get("/:userUuid", getStudentController);
studentRoutes.get("/:userUuid/assignment", getStudentAssignmentController);

export default studentRoutes
