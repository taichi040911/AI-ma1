import type { Static } from "@sinclair/typebox";
import type { FastifyRequest } from "fastify";
import { AppError } from "../lib/errors";
import { UpdateProfileRequestSchema } from "../schemas/profile";
import { updateProfile } from "../services/profileService";

type UpdateProfileBody = Static<typeof UpdateProfileRequestSchema>;

export async function updateProfileHandler(
  request: FastifyRequest<{ Body: UpdateProfileBody }>
) {
  const userId = request.user?.id;
  if (!userId) {
    throw new AppError({
      statusCode: 401,
      code: "unauthorized",
      message: "Authorization required"
    });
  }

  const profile = updateProfile(userId, request.body);

  return {
    success: true,
    data: {
      updated: true,
      profile
    }
  };
}
