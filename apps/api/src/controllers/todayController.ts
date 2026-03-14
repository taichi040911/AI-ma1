import { getWeeklyPlan, pickTodayStep } from "../services/weeklyPlanService";

export async function todayStepHandler() {
  const plan = getWeeklyPlan();
  const step = pickTodayStep(plan.steps) ?? plan.steps[0];

  return {
    success: true,
    data: {
      title: step.title,
      description: step.description,
      estimated_minutes: step.estimated_minutes,
      action_type: step.action_type,
      target_entity_type: step.target_entity_type ?? null,
      target_entity_id: step.target_entity_id ?? null,
      reason: `今週のテーマ「${plan.weekly_theme}」に沿った一歩です。`
    }
  };
}
