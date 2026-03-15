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

export type RecommendationRecord = UserRecommendationItem & {
  purpose_tags: string[];
};

const recommendations: RecommendationRecord[] = [
  {
    candidate_user_id: "b3b2b270-5a1c-4b7e-85d6-4e6ac4f3f101",
    nickname: "Aya",
    age: 26,
    prefecture: "東京",
    primary_image_url: "https://example.com/images/user-aya.jpg",
    purposes: ["friendship", "romance"],
    interests: ["カフェ", "映画"],
    compatibility: {
      summary_label: "自然に話せる",
      reason_text: "落ち着いた雰囲気が近く、会話が続きやすいです。",
      shared_points: ["カフェ好き", "ゆったり映画"]
    },
    recommended_entry_mode: "gentle",
    next_best_action: "共通の映画について聞く",
    relationship_style_hint: "相手のペースに合わせる",
    purpose_tags: ["friendship", "romance"]
  },
  {
    candidate_user_id: "c4b2b270-5a1c-4b7e-85d6-4e6ac4f3f102",
    nickname: "Ren",
    age: 29,
    prefecture: "大阪",
    primary_image_url: "https://example.com/images/user-ren.jpg",
    purposes: ["sports", "community"],
    interests: ["ランニング", "アウトドア"],
    compatibility: {
      summary_label: "アクティブ相性",
      reason_text: "一緒に体を動かすことで距離が縮まります。",
      shared_points: ["朝活", "運動"]
    },
    recommended_entry_mode: "active",
    next_best_action: "週末の運動プランを提案",
    relationship_style_hint: "テンポよく",
    purpose_tags: ["sports", "community"]
  },
  {
    candidate_user_id: "d5b2b270-5a1c-4b7e-85d6-4e6ac4f3f103",
    nickname: "Sora",
    age: 31,
    prefecture: "福岡",
    primary_image_url: "https://example.com/images/user-sora.jpg",
    purposes: ["work", "learning"],
    interests: ["読書", "テック"],
    compatibility: {
      summary_label: "学び相性",
      reason_text: "学びに対する姿勢が近く、話題が広がります。",
      shared_points: ["勉強会", "読書"]
    },
    recommended_entry_mode: "focused",
    next_best_action: "最近の学びを共有",
    relationship_style_hint: "丁寧に",
    purpose_tags: ["work", "learning"]
  }
];

export const recommendationRepository = {
  list() {
    return recommendations;
  }
};
