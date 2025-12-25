import { getAllUsers } from "../services/usersService.js";

export async function getAllUsersController(req, res) {
    const users = await getAllUsers();
    res.json({ success: true, data: users });
}
