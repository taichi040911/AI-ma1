export type ProfileRecord = {
  nickname: string;
  birth_date: string;
  gender: string;
  prefecture: string;
  city?: string;
  bio?: string;
  ai_summary?: string;
  verification_status?: string;
  current_connection_style_hint?: string | null;
  preferred_entry_mode?: string | null;
};

const profilesByUser = new Map<string, ProfileRecord>();

export const profileRepository = {
  findByUserId(userId: string) {
    return profilesByUser.get(userId);
  },
  save(userId: string, profile: ProfileRecord) {
    profilesByUser.set(userId, profile);
    return profile;
  },
  reset() {
    profilesByUser.clear();
  }
};
