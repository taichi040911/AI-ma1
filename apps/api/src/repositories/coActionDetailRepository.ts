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

export type CoActionDetailRecord = {
  action: CoActionItem;
  why_for_you: string;
  suitable_connection_modes: string[];
  matching_users: UserRecommendationItem[];
  matching_events: EventRecommendationItem[];
};

const details = new Map<string, CoActionDetailRecord>([
  [
    "2b1a3e30-4db5-4f5d-8dd0-1c5c53b6d101",
    {
      action: {
        id: "2b1a3e30-4db5-4f5d-8dd0-1c5c53b6d101",
        title: "落ち着いたカフェで10分だけ会話",
        description: "静かな場所で短い時間の会話から始めます。",
        estimated_minutes: 20,
        difficulty: "easy",
        best_for: ["初対面", "落ち着いて話したい"],
        ai_reason: "短い時間で安心感を作れる行動です。"
      },
      why_for_you: "静かな時間を好む傾向があるため、短い会話から始めると自然です。",
      suitable_connection_modes: ["chat", "coffee"],
      matching_users: [
        {
          candidate_user_id: "9c6c6b61-2b1d-4b2d-9b4f-2adf9a1c2101",
          nickname: "Ami",
          age: 27,
          prefecture: "東京",
          primary_image_url: "https://example.com/images/user-ami.jpg",
          purposes: ["friendship", "romance"],
          interests: ["カフェ", "散歩"],
          compatibility: {
            summary_label: "相性良好",
            reason_text: "落ち着いた会話スタイルが合っています。",
            shared_points: ["カフェ巡り", "ゆったり話す"]
          },
          recommended_entry_mode: "gentle",
          next_best_action: "短いメッセージで挨拶",
          relationship_style_hint: "ペースを合わせる"
        }
      ],
      matching_events: [
        {
          event_id: "7a3c0e0b-30b3-4a6a-9c13-8a36f8a41201",
          title: "コーヒー好きの少人数トーク",
          purpose: "friendship",
          prefecture: "東京",
          venue_name: "中目黒カフェ",
          start_at: "2025-03-20T10:00:00Z",
          end_at: "2025-03-20T11:30:00Z",
          participants_count: 6,
          capacity: 12,
          ai_reason: "少人数で落ち着いて話せる雰囲気です。"
        }
      ]
    }
  ],
  [
    "4a1d5b5a-cc4f-4fd2-aac6-8ad2e4a1a202",
    {
      action: {
        id: "4a1d5b5a-cc4f-4fd2-aac6-8ad2e4a1a202",
        title: "週末のウォーキングイベントに参加",
        description: "少人数のイベントで自然に会話が生まれます。",
        estimated_minutes: 60,
        difficulty: "medium",
        best_for: ["共通の趣味", "自然な交流"],
        ai_reason: "動きながら話せるので緊張がほぐれます。"
      },
      why_for_you: "体を動かしながら交流する方が話しやすいタイプです。",
      suitable_connection_modes: ["walk", "group"],
      matching_users: [
        {
          candidate_user_id: "9c6c6b61-2b1d-4b2d-9b4f-2adf9a1c2102",
          nickname: "Kenta",
          age: 30,
          prefecture: "神奈川",
          primary_image_url: "https://example.com/images/user-kenta.jpg",
          purposes: ["sports", "community"],
          interests: ["ランニング", "アウトドア"],
          compatibility: {
            summary_label: "相性良好",
            reason_text: "アクティブな過ごし方が合っています。",
            shared_points: ["朝活", "運動" ]
          },
          recommended_entry_mode: "active",
          next_best_action: "イベント参加を提案",
          relationship_style_hint: "一緒に体験を作る"
        }
      ],
      matching_events: [
        {
          event_id: "7a3c0e0b-30b3-4a6a-9c13-8a36f8a41202",
          title: "朝の公園ウォーク",
          purpose: "sports",
          prefecture: "神奈川",
          venue_name: "みなとみらい公園",
          start_at: "2025-03-22T00:00:00Z",
          end_at: "2025-03-22T01:00:00Z",
          participants_count: 10,
          capacity: 20,
          ai_reason: "自然に会話が始まるウォーキングです。"
        }
      ]
    }
  ]
]);

export const coActionDetailRepository = {
  findById(id: string) {
    return details.get(id) ?? null;
  }
};
