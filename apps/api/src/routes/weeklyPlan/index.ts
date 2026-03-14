import type { FastifyInstance } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { WeeklyPlanResponseSchema } from "../../schemas/weeklyPlan";
import { weeklyPlanHandler } from "../../controllers/weeklyPlanController";

export default async function weeklyPlanRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<TypeBoxTypeProvider>();

  typedApp.get(
    "/weekly-plan",
    {
      schema: {
        response: {
          200: WeeklyPlanResponseSchema
        }
      }
    },
    weeklyPlanHandler
  );
}
