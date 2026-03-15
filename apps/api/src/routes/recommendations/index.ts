import type { FastifyInstance } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import {
  RecommendationQuerySchema,
  UserRecommendationsResponseSchema
} from "../../schemas/recommendations";
import { recommendationListHandler } from "../../controllers/recommendationController";

export default async function recommendationRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<TypeBoxTypeProvider>();

  typedApp.get(
    "/users",
    {
      schema: {
        querystring: RecommendationQuerySchema,
        response: {
          200: UserRecommendationsResponseSchema
        }
      }
    },
    recommendationListHandler
  );
}
