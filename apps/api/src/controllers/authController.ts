import type { Static } from "@sinclair/typebox";
import type { FastifyRequest } from "fastify";
import { RegisterRequestSchema } from "../schemas/auth";
import { registerUser } from "../services/authService";

type RegisterBody = Static<typeof RegisterRequestSchema>;

export async function registerHandler(
  request: FastifyRequest<{ Body: RegisterBody }>
) {
  const result = registerUser(request.body);

  return {
    success: true,
    data: result
  };
}
