import type { FastifyRequest } from "fastify";
import type { Static } from "@sinclair/typebox";
import { AppError } from "../lib/errors";
import { CoActionDetailParamsSchema } from "../schemas/coActionDetail";
import { getCoActionDetail } from "../services/coActionDetailService";

type CoActionDetailParams = Static<typeof CoActionDetailParamsSchema>;

export async function coActionDetailHandler(
  request: FastifyRequest<{ Params: CoActionDetailParams }>
) {
  const detail = getCoActionDetail(request.params.id);

  if (!detail) {
    throw new AppError({
      statusCode: 404,
      code: "co_action_not_found",
      message: "Co-action not found"
    });
  }

  return {
    success: true,
    data: detail
  };
}
