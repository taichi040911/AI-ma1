export type CoActionRecord = {
  id: string;
  title: string;
  description: string;
  estimated_minutes: number | null;
  difficulty: string;
  best_for: string[];
  ai_reason: string;
  moods: string[];
  purposes: string[];
  group_type: string;
};

const coActions: CoActionRecord[] = [
  {
    id: "2b1a3e30-4db5-4f5d-8dd0-1c5c53b6d101",
    title: "落ち着いたカフェで10分だけ会話",
    description: "静かな場所で短い時間の会話から始めます。",
    estimated_minutes: 20,
    difficulty: "easy",
    best_for: ["初対面", "落ち着いて話したい"],
    ai_reason: "短い時間で安心感を作れる行動です。",
    moods: ["calm", "neutral"],
    purposes: ["friendship", "romance"],
    group_type: "one_on_one"
  },
  {
    id: "4a1d5b5a-cc4f-4fd2-aac6-8ad2e4a1a202",
    title: "週末のウォーキングイベントに参加",
    description: "少人数のイベントで自然に会話が生まれます。",
    estimated_minutes: 60,
    difficulty: "medium",
    best_for: ["共通の趣味", "自然な交流"],
    ai_reason: "動きながら話せるので緊張がほぐれます。",
    moods: ["active"],
    purposes: ["sports", "community"],
    group_type: "group"
  },
  {
    id: "7c8d9f10-3f5b-4c2b-b7d2-907a0f1c3303",
    title: "オンライン勉強会に参加",
    description: "学びを軸にした場で接点を作ります。",
    estimated_minutes: 45,
    difficulty: "easy",
    best_for: ["学び", "仕事仲間"],
    ai_reason: "目的が明確なので会話の糸口を作りやすいです。",
    moods: ["focused"],
    purposes: ["work", "learning"],
    group_type: "online"
  },
  {
    id: "9de4c1aa-8f51-4d32-9b36-0a6a4f7e4404",
    title: "アート展示で感想を共有",
    description: "展示の感想を交換することで距離を縮めます。",
    estimated_minutes: 90,
    difficulty: "medium",
    best_for: ["趣味", "感性"],
    ai_reason: "共通の体験があると自然に会話が広がります。",
    moods: ["inspired", "calm"],
    purposes: ["hobby", "culture"],
    group_type: "event"
  }
];

export const coActionRepository = {
  list() {
    return coActions;
  }
};
