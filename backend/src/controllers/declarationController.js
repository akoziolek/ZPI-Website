import { 
    signDeclaration
} from "../services/declarationService.js";

/**
 * Controller: sign the declaration for the authenticated student.
 *
 * Expects `req.params.uuid` (topic UUID) and `req.user.user_id` (authenticated student id).
 * Calls the service which performs validation and signature creation. Returns
 * a JSON success message when complete.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with success message.
 */
export async function signDeclarationController(req, res) {
    const { uuid } = req.params;
    const userId = req.user.user_id;

    await signDeclaration(uuid, userId);
    return res.json({ success: true, message: "Student signed" });    
}