import { Router } from "express";
import { addOpinionController } from "../controllers/opinionsController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";
const opinionsRoutes = Router();

/**
opinionsRoutes.post("/topics/:uuid/approve", authenticateToken, requireRole(['Członek KPK']), validateRequest(approveRejectSchema), approveTopic);
opinionsRoutes.post("/topics/:uuid/reject", authenticateToken, requireRole(['Członek KPK']), validateRequest(approveRejectSchema), rejectTopic);
opinionsRoutes.get("/topics/:uuid/opinion", authenticateToken, getOpinion);
*/


opinionsRoutes.post("/:uuid/opinion", authenticateToken, requireRole(['Członek KPK']), addOpinionController);


export default opinionsRoutes;