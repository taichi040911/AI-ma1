import { Type } from "@sinclair/typebox";

export const CoActionListQuerySchema = Type.Object({
  mood: Type.Optional(Type.String()),
  purpose: Type.Optional(Type.String()),
  group_type: Type.Optional(Type.String()),
  difficulty: Type.Optional(Type.String())
});

export const CoActionItemSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  title: Type.String(),
  description: Type.String(),
  estimated_minutes: Type.Optional(Type.Union([Type.Integer(), Type.Null()])),
  difficulty: Type.String(),
  best_for: Type.Array(Type.String()),
  ai_reason: Type.String()
});

export const CoActionListResponseSchema = Type.Object({
  success: Type.Boolean(),
  data: Type.Object({
    items: Type.Array(CoActionItemSchema)
  })
});
