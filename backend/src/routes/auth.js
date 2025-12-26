import { Router } from "express";
import { authenticateUser } from "../controllers/authController.js";

const authRoutes = Router();

authRoutes.post("/login", authenticateUser);

export default authRoutes;