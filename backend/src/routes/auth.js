import { Router } from "express";
import { authenticateUser, verifyToken } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";
import { handleRefreshToken } from "../controllers/authController.js";

const authRoutes = Router();

authRoutes.post("/login", authenticateUser);
authRoutes.get("/verify", authenticateToken, verifyToken);
authRoutes.post("/refresh", handleRefreshToken);

export default authRoutes;