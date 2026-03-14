import { putJson } from "../../lib/apiClient";

export type UpdateProfileRequest = {
  nickname: string;
  birth_date: string;
  gender: string;
  prefecture: string;
  city?: string;
  bio?: string;
};

export type UpdateProfileResponse = {
  success: boolean;
  data: {
    updated: boolean;
    profile: {
      nickname: string;
      birth_date: string;
      gender: string;
      prefecture: string;
      city?: string;
      bio?: string;
    };
  };
};

export function updateProfile(payload: UpdateProfileRequest, token: string) {
  return putJson<UpdateProfileResponse>("/me/profile", payload, token);
}
