import { 
    signDeclaration
} from "../services/declarationService.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";

export async function signDeclarationController(req, res) {
    const { uuid } = req.params;
    const userId = req.user.user_id;

    try {
        await signDeclaration(uuid, userId);
        return res.json({ success: true, message: "Student signed" });
    } catch (err) {
        let status = 400;
        let errorCode = err.message || "UNKNOWN_ERROR"

        if (err instanceof NotFoundError) status = 404;
        else if (err instanceof ValidationError) {
            if (errorCode === "ALREADY_SIGNED" || errorCode === "TOPIC_NOT_PREPARING") status = 409;
            else status = 400;
        } else status = 500;

        return res.status(status).json({
            success: false,
            errorCode: errorCode,
        })
    }    
}