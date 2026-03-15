import type { FastifyInstance } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { ErrorResponseSchema } from "../../schemas/common";
import {
  CoActionDetailParamsSchema,
  CoActionDetailResponseSchema
} from "../../schemas/coActionDetail";
import { coActionDetailHandler } from "../../controllers/coActionDetailController";

export default async function coActionDetailRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<TypeBoxTypeProvider>();

  typedApp.get(
    "/:id",
    {
      schema: {
        params: CoActionDetailParamsSchema,
        response: {
          200: CoActionDetailResponseSchema,
          404: ErrorResponseSchema
        }
      }
    },
    coActionDetailHandler
  );
}
