import { Type } from "@sinclair/typebox";

export const DiagnosisQuestionSchema = Type.Object({
  code: Type.String(),
  text: Type.String(),
  suggestions: Type.Array(Type.String())
});

export const LifeNavigationStartResponseSchema = Type.Object({
  success: Type.Boolean(),
  data: Type.Object({
    session_id: Type.String({ format: "uuid" }),
    first_question: DiagnosisQuestionSchema,
    current_state_hint: Type.String()
  })
});

export const LifeNavigationAnswerRequestSchema = Type.Object(
  {
    session_id: Type.String({ format: "uuid" }),
    question_code: Type.String(),
    answer_text: Type.String()
  },
  { additionalProperties: false }
);

export const LifeNavigationAnswerResponseSchema = Type.Object({
  success: Type.Boolean(),
  data: Type.Object({
    next_question: Type.Optional(Type.Union([DiagnosisQuestionSchema, Type.Null()])),
    progress: Type.Object({
      current: Type.Integer(),
      total: Type.Integer()
    }),
    tentative_state: Type.Optional(Type.Union([Type.String(), Type.Null()]))
  })
});
