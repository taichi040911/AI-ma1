import { getWeeklyPlan } from "../services/weeklyPlanService";

export async function weeklyPlanHandler() {
  const plan = getWeeklyPlan();

  return {
    success: true,
    data: plan
  };
}
