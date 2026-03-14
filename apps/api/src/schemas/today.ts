import { Type } from "@sinclair/typebox";

export const TodayStepResponseSchema = Type.Object({
  success: Type.Boolean(),
  data: Type.Object({
    title: Type.String(),
    description: Type.String(),
    estimated_minutes: Type.Integer(),
    action_type: Type.String(),
    target_entity_type: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    target_entity_id: Type.Optional(Type.Union([Type.String({ format: "uuid" }), Type.Null()])),
    reason: Type.String()
  })
});
