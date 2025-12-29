import { getTopicSignatures } from "../services/signaturesService.js";
import { NotFoundError } from "../utils/errors.js";

export async function getTopicSignaturesController(req, res) {
    const { uuid } = req.params;
    const signatures = await getTopicSignatures(uuid);

    if (!signatures) {
        throw new NotFoundError("Signatures");
    }

    res.json({ success: true, data: signatures });
}
