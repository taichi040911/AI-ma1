export type CurrentStateRecord = {
  current_mode: string;
  emotional_state: string;
  recommended_pace: string;
  ai_summary: string;
  this_week_focus: string;
  updated_at: number;
};

const stateByUser = new Map<string, CurrentStateRecord>();

export const currentStateRepository = {
  get(userId: string) {
    return stateByUser.get(userId);
  },
  upsert(userId: string, state: Omit<CurrentStateRecord, "updated_at">) {
    const record: CurrentStateRecord = {
      ...state,
      updated_at: Date.now()
    };
    stateByUser.set(userId, record);
    return record;
  },
  reset() {
    stateByUser.clear();
  }
};
