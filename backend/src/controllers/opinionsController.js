import { 
    addOpinion
} from "../services/opinionsService.js";

/**
 * Controller: add an opinion for a given topic.
 *
 * Expects `req.params.uuid` (topic UUID), `req.body.argumentation` and
 * `req.body.isPositive`, and `req.user.user_id` (authenticated employee id).
 * Returns a success message when the opinion is created and status updated.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with success message.
 */
export async function addOpinionController(req, res) {
    const { uuid } = req.params;
    const { argumentation, isPositive } = req.body;
    const userId = req.user.user_id;

    await addOpinion(uuid, argumentation, isPositive, userId);
    res.json({ success: true, message: "Added an opinion" });
}


