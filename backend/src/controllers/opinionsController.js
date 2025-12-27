import { 
    approveTopic, 
    rejectTopic, 
} from "../services/opinionsService.js";

// sprawdzac role uzytkownika oraz status!, część już była w middleware?
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

