import {
    getAllTopics,
    getTopicByUuid,
} from "../services/topicsService.js";
import { NotFoundError } from "../utils/errors.js";

// optional search
export async function getAllTopicsController(req, res) {
    const { search } = req.query;
    const topics = await getAllTopics(search);
    res.json({ success: true, data: topics });
}

export async function getTopicController(req, res) {
    const { uuid } = req.params;
    const topic = await getTopicByUuid(uuid);

    if (!topic) {
        throw new NotFoundError("Topic");
    }

    res.json({ success: true, data: topic });
}
