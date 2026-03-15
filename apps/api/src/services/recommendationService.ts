import { recommendationRepository } from "../repositories/recommendationRepository";

export type RecommendationFilter = {
  purpose?: string;
  prefecture?: string;
};

export function listUserRecommendations(filter: RecommendationFilter) {
  const purpose = (filter.purpose ?? "").trim();
  const prefecture = (filter.prefecture ?? "").trim();

  return recommendationRepository
    .list()
    .filter((item) => {
      if (purpose && !item.purpose_tags.includes(purpose)) {
        return false;
      }
      if (prefecture && item.prefecture !== prefecture) {
        return false;
      }
      return true;
    })
    .map((item) => {
      const { purpose_tags, ...rest } = item;
      void purpose_tags;
      return rest;
    });
}
