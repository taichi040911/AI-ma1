import { Type } from "@sinclair/typebox";

export const WeeklyPlanStepSchema = Type.Object({
  step_order: Type.Integer(),
  day_hint: Type.String(),
  title: Type.String(),
  description: Type.String(),
  estimated_minutes: Type.Integer(),
  action_type: Type.String(),
  target_entity_type: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  target_entity_id: Type.Optional(Type.Union([Type.String({ format: "uuid" }), Type.Null()]))
});

export const WeeklyPlanResponseSchema = Type.Object({
  success: Type.Boolean(),
  data: Type.Object({
    weekly_theme: Type.String(),
    ai_comment: Type.String(),
    suggested_mode: Type.String(),
    steps: Type.Array(WeeklyPlanStepSchema)
  })
});
