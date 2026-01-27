import { Router } from "express";
import { getAllUsersController } from "../controllers/usersController.js";

const userRoutes = Router();

userRoutes.get("/", getAllUsersController);

export default userRoutes;