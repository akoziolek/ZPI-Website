import { 
    joinTopic, 
    withdrawTopic, 
} from "../services/assignmentsService.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";

export async function joinTopicController(req, res) {
    const { uuid } = req.params;
    const userId = req.user.user_id;

    try {
        await joinTopic(uuid, userId);
        return res.json({ success: true, message: "Student joined" });
    } catch (err) {
        let status = 400;
        let errorCode = err.message || "UNKNOWN_ERROR"

        if (err instanceof NotFoundError) status = 404;
        else if (err instanceof ValidationError) {
            if (errorCode === "STUDENTS_LIMIT_REACHED") status = 409;
            else status = 400;
        } else status = 500;

        return res.status(status).json({
            success: false,
            errorCode: errorCode,
        })
    }    
}

export async function withdrawTopicController(req, res) {
    const { uuid } = req.params;
    const userId = req.user.user_id;

    await withdrawTopic(uuid, userId);
    res.json({ success: true, message: "Student withdrew" });
}
