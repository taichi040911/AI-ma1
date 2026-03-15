import { getJson } from "../../lib/apiClient";

export type CoActionItem = {
  id: string;
  title: string;
  description: string;
  estimated_minutes: number | null;
  difficulty: string;
  best_for: string[];
  ai_reason: string;
};

export type CoActionListResponse = {
  success: boolean;
  data: {
    items: CoActionItem[];
  };
};

export type CoActionFilter = {
  mood?: string;
  purpose?: string;
  group_type?: string;
  difficulty?: string;
};

export function fetchCoActions(filter: CoActionFilter = {}) {
  const params = new URLSearchParams();
  if (filter.mood) params.set("mood", filter.mood);
  if (filter.purpose) params.set("purpose", filter.purpose);
  if (filter.group_type) params.set("group_type", filter.group_type);
  if (filter.difficulty) params.set("difficulty", filter.difficulty);

  const query = params.toString();
  const path = query ? `/co-actions?${query}` : "/co-actions";
  return getJson<CoActionListResponse>(path);
}
