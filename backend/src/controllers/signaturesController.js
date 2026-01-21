import { getTopicSignatures } from "../services/signaturesService.js";

/**
 * Controller: return the signatures for a topic's declaration.
 *
 * Expects `req.params.uuid` (topic UUID). Returns a DTO with `signatures` array.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with signatures data.
 */
export async function getTopicSignaturesController(req, res) {
    const { uuid } = req.params;
    const signatures = await getTopicSignatures(uuid);

    res.json({ success: true, data: signatures });
}
