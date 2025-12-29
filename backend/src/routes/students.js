/*
Wymagania Studenta
5.	Przeglądanie Studentów
a)	[GET /student] Jako Student chcę mieć możliwość przeglądania danych innych Studentów, aby sprawdzić, kto został dopisany do tematu, który mnie interesuje lub sprawdzić informacje o danym studencie.
b)	[GET /student/:uuid] Jako Student chcę mieć możliwość wyszukiwania studentów, aby znaleźć dane wybranego studenta.


Wymagania Opiekuna Studentów
1.	Przeglądanie studentów
a)	[GET /student] Jako Opiekun Studentów mieć możliwość przeglądania danych studentów, aby mieć dostęp do listy studentów, którzy mają realizować ZPI.
b)	[GET /student/:uuid] Jako Opiekun Studentów mieć możliwość wyszukiwania danych studentów, aby znaleźć studentów, którzy nie są przypisani do zespołu ZPI.


*/

// validate the request first !

import { Router } from "express"
import { getAllStudentsController, getStudentController, getStudentAssignmentController } from "../controllers/studentsController.js"

const studentRoutes = Router()

//studentRoutes.get("/", authenticateToken, requireRole(['Student', 'Opiekun Studentów']), getAllStudents);
//studentRoutes.get("/:userUuid", authenticateToken, requireRole(['Student', 'Opiekun Studentów']), getStudent);

studentRoutes.get("/", getAllStudentsController);
studentRoutes.get("/:userUuid", getStudentController);
studentRoutes.get("/:userUuid/assignment", getStudentAssignmentController);

export default studentRoutes
