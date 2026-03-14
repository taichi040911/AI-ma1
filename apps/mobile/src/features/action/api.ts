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

export type CompatibilitySummary = {
  summary_label: string;
  reason_text: string;
  shared_points: string[];
};

export type UserRecommendationItem = {
  candidate_user_id: string;
  nickname: string;
  age: number;
  prefecture: string;
  primary_image_url: string;
  purposes: string[];
  interests: string[];
  compatibility: CompatibilitySummary;
  recommended_entry_mode: string | null;
  next_best_action: string | null;
  relationship_style_hint: string | null;
};

export type EventRecommendationItem = {
  event_id: string;
  title: string;
  purpose: string;
  prefecture: string;
  venue_name: string;
  start_at: string;
  end_at: string;
  participants_count: number;
  capacity: number;
  ai_reason: string;
};

export type CoActionListResponse = {
  success: boolean;
  data: {
    items: CoActionItem[];
  };
};

export type CoActionDetailResponse = {
  success: boolean;
  data: {
    action: CoActionItem;
    why_for_you: string;
    suitable_connection_modes: string[];
    matching_users: UserRecommendationItem[];
    matching_events: EventRecommendationItem[];
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

export function fetchCoActionDetail(id: string) {
  return getJson<CoActionDetailResponse>(`/co-actions/${id}`);
}
