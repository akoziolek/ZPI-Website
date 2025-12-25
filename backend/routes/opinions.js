import { Router } from "express";
import { approveTopicController, rejectTopicController, getOpinionController } from "../src/controllers/opinionsController.js";

const opinionsRoutes = Router();

// Approve topic (KPK member)
opinionsRoutes.post("/topics/:uuid/approve", approveTopicController);

// Reject topic (KPK member)
opinionsRoutes.post("/topics/:uuid/reject", rejectTopicController);

// Get opinion for topic
opinionsRoutes.get("/topics/:uuid/opinion", getOpinionController);

export default opinionsRoutes;