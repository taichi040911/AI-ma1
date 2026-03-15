import type { FastifyRequest } from "fastify";
import type { Static } from "@sinclair/typebox";
import { RecommendationQuerySchema } from "../schemas/recommendations";
import { listUserRecommendations } from "../services/recommendationService";

type RecommendationQuery = Static<typeof RecommendationQuerySchema>;

export async function recommendationListHandler(
  request: FastifyRequest<{ Querystring: RecommendationQuery }>
) {
  const items = listUserRecommendations(request.query ?? {});

  return {
    success: true,
    data: {
      items
    },
    meta: {
      page: 1,
      limit: items.length,
      total: items.length
    }
  };
}
