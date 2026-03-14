import { Type } from "@sinclair/typebox";

export const CurrentStateResponseSchema = Type.Object({
  success: Type.Boolean(),
  data: Type.Object({
    current_mode: Type.String(),
    emotional_state: Type.String(),
    recommended_pace: Type.String(),
    ai_summary: Type.String(),
    this_week_focus: Type.String()
  })
});
