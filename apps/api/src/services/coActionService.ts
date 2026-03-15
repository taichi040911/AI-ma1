import { coActionRepository, type CoActionRecord } from "../repositories/coActionRepository";

export type CoActionFilter = {
  mood?: string;
  purpose?: string;
  group_type?: string;
  difficulty?: string;
};

export type CoActionListItem = Pick<
  CoActionRecord,
  "id" | "title" | "description" | "estimated_minutes" | "difficulty" | "best_for" | "ai_reason"
>;

const normalize = (value?: string) => (value ?? "").trim();

export function listCoActions(filter: CoActionFilter): CoActionListItem[] {
  const mood = normalize(filter.mood);
  const purpose = normalize(filter.purpose);
  const groupType = normalize(filter.group_type);
  const difficulty = normalize(filter.difficulty);

  return coActionRepository
    .list()
    .filter((action) => {
      if (difficulty && action.difficulty !== difficulty) {
        return false;
      }
      if (groupType && action.group_type !== groupType) {
        return false;
      }
      if (mood && !action.moods.includes(mood)) {
        return false;
      }
      if (purpose && !action.purposes.includes(purpose)) {
        return false;
      }
      return true;
    })
    .map((action) => ({
      id: action.id,
      title: action.title,
      description: action.description,
      estimated_minutes: action.estimated_minutes,
      difficulty: action.difficulty,
      best_for: action.best_for,
      ai_reason: action.ai_reason
    }));
}
