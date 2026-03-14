import type { FastifyRequest } from "fastify";
import { AppError } from "../lib/errors";

export async function requireAuth(request: FastifyRequest) {
  const header = request.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new AppError({
      statusCode: 401,
      code: "unauthorized",
      message: "Authorization required"
    });
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    throw new AppError({
      statusCode: 401,
      code: "unauthorized",
      message: "Authorization required"
    });
  }

  request.user = { id: token };
}
