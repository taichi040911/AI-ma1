export type WeeklyPlanStep = {
  step_order: number;
  day_hint: string;
  title: string;
  description: string;
  estimated_minutes: number;
  action_type: string;
  target_entity_type?: string | null;
  target_entity_id?: string | null;
};

export type WeeklyPlanResult = {
  weekly_theme: string;
  ai_comment: string;
  suggested_mode: string;
  steps: WeeklyPlanStep[];
};

export function getWeeklyPlan(): WeeklyPlanResult {
  return {
    weekly_theme: "今週は新しい接点を増やす週",
    ai_comment: "小さな行動を積み重ねることで、自然な出会いが生まれやすくなります。",
    suggested_mode: "balanced",
    steps: [
      {
        step_order: 1,
        day_hint: "Day 1",
        title: "近所のカフェで5分だけ滞在する",
        description: "普段行かない場所に短時間滞在してみましょう。",
        estimated_minutes: 15,
        action_type: "solo",
        target_entity_type: null,
        target_entity_id: null
      },
      {
        step_order: 2,
        day_hint: "Day 3",
        title: "趣味のオンラインイベントに参加",
        description: "興味があるテーマのイベントで気軽に交流。",
        estimated_minutes: 45,
        action_type: "community",
        target_entity_type: "event",
        target_entity_id: null
      },
      {
        step_order: 3,
        day_hint: "Day 5",
        title: "気になる人にリアクションを送る",
        description: "気になるプロフィールに一言コメントしてみましょう。",
        estimated_minutes: 10,
        action_type: "connection",
        target_entity_type: "user",
        target_entity_id: null
      }
    ]
  };
}

export function pickTodayStep(steps: WeeklyPlanStep[]) {
  if (steps.length === 0) {
    return null;
  }
  const index = new Date().getDay() % steps.length;
  return steps[index];
}
