import { Router } from "express";
import { getTopicSignaturesController } from "../controllers/signaturesController.js";
import { authenticateToken } from "../middleware/auth.js";
const signaturesRoutes = Router();

signaturesRoutes.get("/:uuid/signatures", authenticateToken, getTopicSignaturesController);

export default signaturesRoutes;