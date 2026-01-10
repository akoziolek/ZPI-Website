import prisma from "../lib/db.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";
import { STATUSES } from "../config.js";
import { findStatus } from "./statusService.js";
import { updateStatus } from "./topicsService.js";

async function createSignature(userId, declarationId) {
    await prisma.signature.create({
        data: {
            user: { connect: { user_id: userId } },
            declaration: { connect: { declaration_id: declarationId } },
        },
    });
}

export async function signDeclaration(topicUuid, userId) {
    const topic = await prisma.topic.findUnique({
        where: { uuid: topicUuid },
        include: { 
            status: true, 
            _count: { select: { students: true } }, 
            declaration: { include: { signatures: true }, }, 
        },
    });

    if (!topic) {
        throw new NotFoundError("Topic not found");
    }

    if (!topic.declaration) {
        throw new NotFoundError("Declaration not foundN")
    }

    if (topic.status.status_name !== STATUSES.PREPARING) {
        throw new ValidationError("Topic must be in 'W przygotowaniu do słożenia wniosku' status to be signed");
    }

    const declarationId = topic.declaration.declaration_id

    const existingSignature = await prisma.signature.findUnique({
        where: {
            user_id_declaration_id: {
                user_id: userId,
                declaration_id: declarationId,
            },
        },
    });

    if (existingSignature) {
        throw new ValidationError("ALREADY_SIGNED");
    }

    await createSignature(userId, declarationId);


    const studentCount = await prisma.student.count({ where: { topic_id: topic.topic_id } })
    const signatureCount = await prisma.signature.count({ where: { declaration_id: declarationId } })

    if (studentCount === signatureCount) {
        const submittedStatus = await findStatus(STATUSES.SUBMITTED);
        if (submittedStatus) {
            await updateStatus(topicUuid, submittedStatus.status_id);
        }
    }
}