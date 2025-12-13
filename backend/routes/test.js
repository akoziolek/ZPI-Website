import { Router } from "express"
import { getUsers, createUser, getUserById } from "../controllers/testController.js"

const userRoutes = Router()

userRoutes.get("/", getUsers)
userRoutes.get("/:id", getUserById)
userRoutes.post("/", createUser)


export default userRoutes
