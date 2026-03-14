import type { FastifyRequest } from "fastify";
import type { Static } from "@sinclair/typebox";
import { CoActionListQuerySchema } from "../schemas/coActions";
import { listCoActions } from "../services/coActionService";

type CoActionListQuery = Static<typeof CoActionListQuerySchema>;

export async function coActionListHandler(
  request: FastifyRequest<{ Querystring: CoActionListQuery }>
) {
  const items = listCoActions(request.query ?? {});

  return {
    success: true,
    data: {
      items
    }
  };
}
