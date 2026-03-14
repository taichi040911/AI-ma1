import type { FastifyInstance } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import {
  CoActionListQuerySchema,
  CoActionListResponseSchema
} from "../../schemas/coActions";
import { coActionListHandler } from "../../controllers/coActionController";

export default async function coActionRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<TypeBoxTypeProvider>();

  typedApp.get(
    "/",
    {
      schema: {
        querystring: CoActionListQuerySchema,
        response: {
          200: CoActionListResponseSchema
        }
      }
    },
    coActionListHandler
  );
}
