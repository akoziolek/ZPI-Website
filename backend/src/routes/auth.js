import { Router } from "express";
import { authenticateUser, verifyToken, handleRefreshToken } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";


const authRoutes = Router();

authRoutes.post("/login", authenticateUser);
authRoutes.get("/verify", authenticateToken, verifyToken);
authRoutes.post("/refresh", handleRefreshToken);

export default authRoutes;