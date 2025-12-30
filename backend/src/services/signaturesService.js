import prisma from "../lib/db.js";
import {
    NotFoundError,
} from "../utils/errors.js";

export function mapSignatureToDto(declaration) {
  return {
    signatures: declaration.signatures.map(({ user }) => ({
     uuid: user.uuid,
      name: user.name,
      surname: user.surname,
      role_name: user.role.role_name,
    })),
  };
}

export const getTopicSignatures = async (topicUuid) => {
  const topic = await prisma.topic.findFirst({
    where: { uuid: topicUuid },
    select: {
      declaration: {
        select: {
          signatures: {
            select: {
              user: {
                select: {
                  uuid: true,
                  name: true,
                  surname: true,
                  role: {
                    select: { role_name: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!topic || !topic.declaration) {
    throw new NotFoundError('Signatures');
  }

  return mapSignatureToDto(topic.declaration);
};
