import { 
    addOpinion
} from "../services/opinionsService.js";
export async function addOpinionController(req, res) {
    const { uuid } = req.params;
    const { argumentation, isPositive } = req.body;
    const userId = req.user.user_id;

    await addOpinion(uuid, argumentation, isPositive, userId);
    res.json({ success: true, message: isPositive ? "Topic rejected" : "Topic approved" });
}


