import type { FastifyRequest } from "fastify";
import { extractUserId } from "../lib/auth";
import { currentStateRepository } from "../repositories/currentStateRepository";
import { getWeeklyPlan } from "../services/weeklyPlanService";

export async function currentStateHandler(request: FastifyRequest) {
  const userId = extractUserId(request) ?? "guest";
  const stored = currentStateRepository.get(userId);
  if (stored) {
    return {
      success: true,
      data: {
        current_mode: stored.current_mode,
        emotional_state: stored.emotional_state,
        recommended_pace: stored.recommended_pace,
        ai_summary: stored.ai_summary,
        this_week_focus: stored.this_week_focus
      }
    };
  }

  const weeklyPlan = getWeeklyPlan();

  return {
    success: true,
    data: {
      current_mode: "explore",
      emotional_state: "neutral",
      recommended_pace: weeklyPlan.suggested_mode,
      ai_summary: "まだ回答がありません。今日の一歩から始めましょう。",
      this_week_focus: weeklyPlan.weekly_theme
    }
  };
}
