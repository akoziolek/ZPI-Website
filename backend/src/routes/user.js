import { Router } from "express";
import { getAllUsersController } from "../controllers/usersController.js";

const userRoutes = Router();

/**
// Login (no auth required)
userRoutes.post("/login", validateRequest(loginSchema), login);

// Dev login - select user by ID (development only)
userRoutes.post("/dev/login/:userId", devLogin);

// Get all users (for dev user selection menu - no auth for development)
userRoutes.get("/", getAllUsersController);

// Admin: Add user
userRoutes.post("/", authenticateToken, requireRole(['Administrator']), validateRequest(createUserSchema), addUser);

// Admin: Edit user
userRoutes.put("/:id", authenticateToken, requireRole(['Administrator']), validateRequest(updateUserSchema), editUser);

// Admin: Delete user
userRoutes.delete("/:id", authenticateToken, requireRole(['Administrator']), deleteUserController);

// Admin: Import users
userRoutes.post("/import", authenticateToken, requireRole(['Administrator']), importUsersController);
*/

userRoutes.get("/", getAllUsersController);


export default userRoutes;