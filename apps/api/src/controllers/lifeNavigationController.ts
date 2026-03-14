import type { FastifyRequest } from "fastify";
import type { Static } from "@sinclair/typebox";
import {
  LifeNavigationAnswerRequestSchema
} from "../schemas/lifeNavigation";
import {
  answerLifeNavigation,
  startLifeNavigation
} from "../services/lifeNavigationService";

type LifeNavigationAnswerBody = Static<typeof LifeNavigationAnswerRequestSchema>;

export async function lifeNavigationStartHandler(request: FastifyRequest) {
  const userId = request.user?.id;
  const result = startLifeNavigation(userId);

  return {
    success: true,
    data: result
  };
}

export async function lifeNavigationAnswerHandler(
  request: FastifyRequest<{ Body: LifeNavigationAnswerBody }>
) {
  const result = answerLifeNavigation(request.body);

  return {
    success: true,
    data: result
  };
}
