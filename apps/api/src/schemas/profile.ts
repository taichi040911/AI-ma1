import { Type } from "@sinclair/typebox";

export const ProfileSchema = Type.Object({
  nickname: Type.String(),
  birth_date: Type.String({ format: "date" }),
  gender: Type.String(),
  prefecture: Type.String(),
  city: Type.Optional(Type.String()),
  bio: Type.Optional(Type.String()),
  ai_summary: Type.Optional(Type.String()),
  verification_status: Type.Optional(Type.String()),
  current_connection_style_hint: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  preferred_entry_mode: Type.Optional(Type.Union([Type.String(), Type.Null()]))
});

export const UpdateProfileRequestSchema = Type.Object(
  {
    nickname: Type.String(),
    birth_date: Type.String({ format: "date" }),
    gender: Type.String(),
    prefecture: Type.String(),
    city: Type.Optional(Type.String()),
    bio: Type.Optional(Type.String())
  },
  { additionalProperties: false }
);

export const UpdateProfileResponseSchema = Type.Object({
  success: Type.Boolean(),
  data: Type.Object({
    updated: Type.Boolean(),
    profile: ProfileSchema
  })
});
