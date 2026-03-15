import { Type } from "@sinclair/typebox";

export const CoActionDetailParamsSchema = Type.Object({
  id: Type.String({ format: "uuid" })
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

export const CompatibilitySummarySchema = Type.Object({
  summary_label: Type.String(),
  reason_text: Type.String(),
  shared_points: Type.Array(Type.String())
});

export const UserRecommendationItemSchema = Type.Object({
  candidate_user_id: Type.String({ format: "uuid" }),
  nickname: Type.String(),
  age: Type.Integer(),
  prefecture: Type.String(),
  primary_image_url: Type.String(),
  purposes: Type.Array(Type.String()),
  interests: Type.Array(Type.String()),
  compatibility: CompatibilitySummarySchema,
  recommended_entry_mode: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  next_best_action: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  relationship_style_hint: Type.Optional(Type.Union([Type.String(), Type.Null()]))
});

export const EventRecommendationItemSchema = Type.Object({
  event_id: Type.String({ format: "uuid" }),
  title: Type.String(),
  purpose: Type.String(),
  prefecture: Type.String(),
  venue_name: Type.String(),
  start_at: Type.String({ format: "date-time" }),
  end_at: Type.String({ format: "date-time" }),
  participants_count: Type.Integer(),
  capacity: Type.Integer(),
  ai_reason: Type.String()
});

export const CoActionDetailResponseSchema = Type.Object({
  success: Type.Boolean(),
  data: Type.Object({
    action: CoActionItemSchema,
    why_for_you: Type.String(),
    suitable_connection_modes: Type.Array(Type.String()),
    matching_users: Type.Array(UserRecommendationItemSchema),
    matching_events: Type.Array(EventRecommendationItemSchema)
  })
});
