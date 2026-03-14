import { AppError } from "../lib/errors";
import { profileRepository, type ProfileRecord } from "../repositories/profileRepository";

export type UpdateProfileInput = {
  nickname: string;
  birth_date: string;
  gender: string;
  prefecture: string;
  city?: string;
  bio?: string;
};

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function requireNonEmpty(value: string, field: string) {
  if (value.trim().length === 0) {
    throw new AppError({
      statusCode: 400,
      code: "invalid_profile",
      message: `${field} is required`
    });
  }
}

export function updateProfile(userId: string, input: UpdateProfileInput) {
  requireNonEmpty(input.nickname, "nickname");
  requireNonEmpty(input.birth_date, "birth_date");
  requireNonEmpty(input.gender, "gender");
  requireNonEmpty(input.prefecture, "prefecture");

  if (!DATE_REGEX.test(input.birth_date)) {
    throw new AppError({
      statusCode: 400,
      code: "invalid_profile",
      message: "birth_date must be YYYY-MM-DD"
    });
  }

  const profile: ProfileRecord = {
    nickname: input.nickname,
    birth_date: input.birth_date,
    gender: input.gender,
    prefecture: input.prefecture,
    city: input.city,
    bio: input.bio,
    ai_summary: "",
    verification_status: "unverified",
    current_connection_style_hint: null,
    preferred_entry_mode: null
  };

  profileRepository.save(userId, profile);

  return profile;
}
