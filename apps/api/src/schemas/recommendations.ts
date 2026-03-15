import { Type } from "@sinclair/typebox";

export const RecommendationQuerySchema = Type.Object({
  purpose: Type.Optional(Type.String()),
  prefecture: Type.Optional(Type.String())
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

export const PaginationMetaSchema = Type.Object({
  page: Type.Integer(),
  limit: Type.Integer(),
  total: Type.Integer()
});

export const UserRecommendationsResponseSchema = Type.Object({
  success: Type.Boolean(),
  data: Type.Object({
    items: Type.Array(UserRecommendationItemSchema)
  }),
  meta: PaginationMetaSchema
});
