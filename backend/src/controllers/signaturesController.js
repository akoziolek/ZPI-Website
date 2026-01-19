import { getTopicSignatures } from "../services/signaturesService.js";

export async function getTopicSignaturesController(req, res) {
    const { uuid } = req.params;
    const signatures = await getTopicSignatures(uuid);

    res.json({ success: true, data: signatures });
}
