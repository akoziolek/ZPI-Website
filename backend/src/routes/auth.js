import { Router } from "express";
import { authenticateUser, verifyToken } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const authRoutes = Router();

authRoutes.post("/login", authenticateUser);
authRoutes.get("/verify", authenticateToken, verifyToken);

export default authRoutes;