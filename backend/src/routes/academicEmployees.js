import { Router } from "express";
import { getAllAcademicEmployeesController, getAcademicEmployeeController } from "../controllers/academicEmployeesController.js";

const academicEmployeesRoutes = Router();

academicEmployeesRoutes.get("/", getAllAcademicEmployeesController);
academicEmployeesRoutes.get("/:uuid", getAcademicEmployeeController);

export default academicEmployeesRoutes;
