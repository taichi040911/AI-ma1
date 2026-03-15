import { getJson } from "../../lib/apiClient";

export type TodayStepResponse = {
  success: boolean;
  data: {
    title: string;
    description: string;
    estimated_minutes: number;
    action_type: string;
    target_entity_type: string | null;
    target_entity_id: string | null;
    reason: string;
  };
};

export type WeeklyPlanResponse = {
  success: boolean;
  data: {
    weekly_theme: string;
    ai_comment: string;
    suggested_mode: string;
    steps: {
      step_order: number;
      day_hint: string;
      title: string;
      description: string;
      estimated_minutes: number;
      action_type: string;
      target_entity_type: string | null;
      target_entity_id: string | null;
    }[];
  };
};

export type CurrentStateResponse = {
  success: boolean;
  data: {
    current_mode: string;
    emotional_state: string;
    recommended_pace: string;
    ai_summary: string;
    this_week_focus: string;
  };
};

export function fetchTodayStep() {
  return getJson<TodayStepResponse>("/ai/today-step");
}

export function fetchWeeklyPlan() {
  return getJson<WeeklyPlanResponse>("/ai/weekly-plan");
}

export function fetchCurrentState() {
  return getJson<CurrentStateResponse>("/me/current-state");
}
