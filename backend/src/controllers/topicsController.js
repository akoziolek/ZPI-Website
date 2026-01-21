import {
    getAllTopics,
    getTopicByUuid,
} from "../services/topicsService.js";

/**
 * Controller: get a list of topics, optionally filtered by a `search` query string.
 *
 * Query params:
 * - `search` (optional): case-insensitive substring to match topic names.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with topics data.
 */
export async function getAllTopicsController(req, res) {
    const { search } = req.query;
    const topics = await getAllTopics(search);
    res.json({ success: true, data: topics });
}

/**
 * Controller: return a single topic by UUID.
 *
 * Expects `req.params.uuid` to contain the topic UUID.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with topic data.
 */
export async function getTopicController(req, res) {
    const { uuid } = req.params;
    const topic = await getTopicByUuid(uuid);

    res.json({ success: true, data: topic });
}
