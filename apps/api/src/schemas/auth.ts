import { Type } from "@sinclair/typebox";

export const RegisterRequestSchema = Type.Object(
  {
    email: Type.String({ format: "email" }),
    password: Type.String(),
    agreed_to_terms: Type.Boolean(),
    agreed_to_privacy: Type.Boolean()
  },
  { additionalProperties: false }
);

export const RegisterResponseSchema = Type.Object({
  success: Type.Boolean(),
  data: Type.Object({
    user_id: Type.String({ format: "uuid" }),
    email: Type.String(),
    status: Type.String()
  })
});
