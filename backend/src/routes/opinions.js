import { Router } from "express";
import { addOpinionController } from "../controllers/opinionsController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";
const opinionsRoutes = Router();

opinionsRoutes.post("/:uuid/opinion", authenticateToken, requireRole(['Członek KPK']), addOpinionController);


export default opinionsRoutes;