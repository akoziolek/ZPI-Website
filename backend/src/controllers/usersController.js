import { getAllUsers } from "../services/usersService.js";

/**
 * Controller: return all users in the system.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with users data.
 */
export async function getAllUsersController(req, res) {
    const users = await getAllUsers();
    res.json({ success: true, data: users });
}

// TO DO: api that returns users for the demo login