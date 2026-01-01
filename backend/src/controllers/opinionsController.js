import { 
    approveTopic, 
    rejectTopic, 
} from "../services/opinionsService.js";

// rola sprawdzana w middleware and status in service
export async function approveTopicController(req, res) {
    const { uuid } = req.params;
    const { argumentation } = req.body;
    const userId = req.user.user_id;

    await approveTopic(uuid, argumentation, userId);
    res.json({ success: true, message: "Topic approved" });
}

export async function rejectTopicController(req, res) {
    const { uuid } = req.params;
    const { argumentation } = req.body;
    const userId = req.user.user_id;

    await rejectTopic(uuid, argumentation, userId);
    res.json({ success: true, message: "Topic rejected" });
}

