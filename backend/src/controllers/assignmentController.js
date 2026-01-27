import { 
    joinTopic, 
    withdrawTopic, 
} from "../services/assignmentsService.js";


/**
 * Controller: join a topic for the authenticated student.
 *
 * Expects `req.params.uuid` to contain the topic UUID and `req.user.user_id`
 * to hold the authenticated user's internal id (middleware should attach it).
 * Responds with JSON success message on completion.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with success message.
 */
export async function joinTopicController(req, res) {
    const { uuid } = req.params;
    const userId = req.user.user_id;

    await joinTopic(uuid, userId);
    return res.json({ success: true, message: "Student joined" });  
}

/**
 * Controller: withdraw the authenticated student from the given topic.
 *
 * Expects `req.params.uuid` and `req.user.user_id` to be present. Returns
 * a JSON success message after the withdraw completes.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with success message.
 */
export async function withdrawTopicController(req, res) {
    const { uuid } = req.params;
    const userId = req.user.user_id;

    await withdrawTopic(uuid, userId);
    res.json({ success: true, message: "Student withdrew" });
}
