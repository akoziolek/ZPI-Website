import prismaClient from "../lib/db.js";
import {
    NotFoundError,
} from "../utils/errors.js";

/**
 * Map a declaration record (with nested signatures) into a DTO containing
 * an array of signature authors.
 *
 * @param {Object} declaration - Declaration record containing signatures.
 * @returns {Object} Object with a `signatures` array of simplified user info.
 */
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

/**
 * Return signatures (users who signed a declaration) for a given topic UUID.
 *
 * @param {string} topicUuid - UUID of the topic whose declaration signatures to fetch.
 * @throws {NotFoundError} When the topic or declaration is not found.
 * @returns {Promise<Object>} DTO with `signatures` array.
 */
export const getTopicSignatures = async (topicUuid) => {
  const topic = await prismaClient.topic.findUnique({
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

  if (!topic?.declaration) {
    throw new NotFoundError('Signatures');
  }

  return mapSignatureToDto(topic.declaration);
};
