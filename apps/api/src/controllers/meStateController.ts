export async function currentStateHandler() {
  return {
    success: true,
    data: {
      current_mode: "explore",
      emotional_state: "前向き",
      recommended_pace: "ゆったり",
      ai_summary: "新しい接点に少し前向きになってきています。",
      this_week_focus: "小さな会話のきっかけ作り"
    }
  };
}
