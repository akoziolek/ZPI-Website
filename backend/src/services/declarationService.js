import prismaClient from "../lib/db.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";
import { STATUSES } from "../config.js";
import { findStatus } from "./statusService.js";
import { updateStatus } from "./topicsService.js";

async function createSignature(userId, declarationId) {
    await prismaClient.signature.create({
        data: {
            user: { connect: { user_id: userId } },
            declaration: { connect: { declaration_id: declarationId } },
        },
    });
}

/**
 * Sign the declaration attached to a topic on behalf of a student.
 *
 * Validates that the topic and its declaration exist and that the topic is
 * in the PREPARING status. Ensures a student cannot sign more than once.
 * After creating the signature, if the number of signatures reaches the
 * required threshold (all signatures), the topic status is
 * advanced to SUBMITTED.
 *
 * @param {string} topicUuid - UUID of the topic whose declaration will be signed.
 * @param {number} userId - Internal database id of the student signing.
 * @throws {NotFoundError} When the topic or declaration is missing.
 * @throws {ValidationError} If the topic is not in PREPARING status or the user already signed.
 * @returns {Promise<void>} Resolves when the signature (and any status update) completes.
 */
export async function signDeclaration(topicUuid, userId) {
    const topic = await prismaClient.topic.findUnique({
        where: { uuid: topicUuid },
        include: { 
            status: true, 
            students: true,
            declaration: { include: { signatures: true }, }, 
        },
    });

    if (!topic) {
        throw new NotFoundError("Topic not found");
    }

    if (!topic.declaration) {
        throw new NotFoundError("Declaration not found")
    }

    if (topic.status.status_name !== STATUSES.PREPARING) {
        throw new ValidationError("Topic must be in 'W przygotowaniu do słożenia wniosku' status to be signed");
    }

    const assignedStudent = topic.students.some((student) => student.user_id === userId)

    if (!assignedStudent) {
        throw new ValidationError("Student must be assigned to topic to sign it");
    }

    const declarationId = topic.declaration.declaration_id

    const signatureExists = topic.declaration.signatures.some((signature) => signature.user_id === userId);

    if (signatureExists) {
        throw new ValidationError("ALREADY_SIGNED");
    }

    await createSignature(userId, declarationId);

    const studentCount = topic.students.length
    const signatureCount = topic.declaration.signatures.length // without just added signature

    if (studentCount === (signatureCount+1)) {
        const submittedStatus = await findStatus(STATUSES.SUBMITTED);
        if (submittedStatus) {
            await updateStatus(topicUuid, submittedStatus.status_id);
        }
    }
}