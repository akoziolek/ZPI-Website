import { 
    signDeclaration
} from "../services/declarationService.js";

export async function signDeclarationController(req, res) {
    const { uuid } = req.params;
    const userId = req.user.user_id;

    await signDeclaration(uuid, userId);
    return res.json({ success: true, message: "Student signed" });    
}