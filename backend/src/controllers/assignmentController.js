import { 
    joinTopic, 
    withdrawTopic, 
} from "../services/assignmentsService.js";


export async function joinTopicController(req, res) {
    const { uuid } = req.params;
    const userId = req.user.user_id;

    await joinTopic(uuid, userId);
    return res.json({ success: true, message: "Student joined" });  
}

export async function withdrawTopicController(req, res) {
    const { uuid } = req.params;
    const userId = req.user.user_id;

    await withdrawTopic(uuid, userId);
    res.json({ success: true, message: "Student withdrew" });
}
