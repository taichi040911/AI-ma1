export type UserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  status: string;
  createdAt: Date;
};

const usersByEmail = new Map<string, UserRecord>();

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export const userRepository = {
  findByEmail(email: string) {
    return usersByEmail.get(normalizeEmail(email));
  },
  create(user: UserRecord) {
    usersByEmail.set(normalizeEmail(user.email), user);
    return user;
  },
  reset() {
    usersByEmail.clear();
  }
};
