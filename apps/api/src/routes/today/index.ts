import type { FastifyInstance } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { todayStepHandler } from "../../controllers/todayController";
import { TodayStepResponseSchema } from "../../schemas/today";

export default async function todayRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<TypeBoxTypeProvider>();

  typedApp.get(
    "/today-step",
    {
      schema: {
        response: {
          200: TodayStepResponseSchema
        }
      }
    },
    todayStepHandler
  );

}
