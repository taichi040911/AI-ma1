import type { FastifyInstance } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { ErrorResponseSchema } from "../../schemas/common";
import {
  LifeNavigationStartResponseSchema,
  LifeNavigationAnswerRequestSchema,
  LifeNavigationAnswerResponseSchema
} from "../../schemas/lifeNavigation";
import {
  lifeNavigationStartHandler,
  lifeNavigationAnswerHandler
} from "../../controllers/lifeNavigationController";

export default async function lifeNavigationRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<TypeBoxTypeProvider>();

  typedApp.post(
    "/start",
    {
      schema: {
        response: {
          200: LifeNavigationStartResponseSchema,
          500: ErrorResponseSchema
        }
      }
    },
    lifeNavigationStartHandler
  );

  typedApp.post(
    "/answer",
    {
      schema: {
        body: LifeNavigationAnswerRequestSchema,
        response: {
          200: LifeNavigationAnswerResponseSchema,
          400: ErrorResponseSchema
        }
      }
    },
    lifeNavigationAnswerHandler
  );
}
