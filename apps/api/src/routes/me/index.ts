import type { FastifyInstance } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { requireAuth } from "../../middlewares/authMiddleware";
import {
  UpdateProfileRequestSchema,
  UpdateProfileResponseSchema
} from "../../schemas/profile";
import { ErrorResponseSchema } from "../../schemas/common";
import { updateProfileHandler } from "../../controllers/meController";
import { currentStateHandler } from "../../controllers/meStateController";
import { CurrentStateResponseSchema } from "../../schemas/meState";

export default async function meRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<TypeBoxTypeProvider>();

  typedApp.put(
    "/profile",
    {
      preHandler: requireAuth,
      schema: {
        body: UpdateProfileRequestSchema,
        response: {
          200: UpdateProfileResponseSchema,
          400: ErrorResponseSchema,
          401: ErrorResponseSchema
        }
      }
    },
    updateProfileHandler
  );

  typedApp.get(
    "/current-state",
    {
      schema: {
        response: {
          200: CurrentStateResponseSchema
        }
      }
    },
    currentStateHandler
  );
}
