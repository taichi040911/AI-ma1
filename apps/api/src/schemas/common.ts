import { Type } from "@sinclair/typebox";

export const ErrorDetailSchema = Type.Object({}, { additionalProperties: true });

export const ErrorResponseSchema = Type.Object({
  success: Type.Boolean(),
  error: Type.Object({
    code: Type.String(),
    message: Type.String(),
    details: Type.Optional(Type.Array(ErrorDetailSchema))
  })
});
