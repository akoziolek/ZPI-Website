import { Router } from "express";
import { approveTopicController, rejectTopicController } from "../controllers/opinionsController.js";

const opinionsRoutes = Router();

/**
opinionsRoutes.post("/topics/:uuid/approve", authenticateToken, requireRole(['Członek KPK']), validateRequest(approveRejectSchema), approveTopic);
opinionsRoutes.post("/topics/:uuid/reject", authenticateToken, requireRole(['Członek KPK']), validateRequest(approveRejectSchema), rejectTopic);
opinionsRoutes.get("/topics/:uuid/opinion", authenticateToken, getOpinion);
*/

opinionsRoutes.post("/:uuid/approve", approveTopicController);
opinionsRoutes.post("/:uuid/reject", rejectTopicController);


export default opinionsRoutes;