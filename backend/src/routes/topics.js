import { Router } from "express";
import {
    getAllTopicsController,
    getTopicController,
} from "../controllers/topicsController.js";
import {
    joinTopicController,
    withdrawTopicController,
} from "../controllers/assignmentController.js";
import {
    signDeclarationController
} from "../controllers/declarationController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const topicRoutes = Router();

topicRoutes.get("/", authenticateToken, getAllTopicsController);
topicRoutes.get("/:uuid", authenticateToken, getTopicController);
topicRoutes.post("/:uuid/join", authenticateToken, requireRole(['Student']), joinTopicController);
topicRoutes.delete("/:uuid/withdraw", authenticateToken, requireRole(['Student']), withdrawTopicController);
topicRoutes.post("/:uuid/sign", authenticateToken, requireRole(['Student']), signDeclarationController);


export default topicRoutes;
