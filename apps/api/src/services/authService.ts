import { randomUUID, scryptSync } from "crypto";
import { AppError } from "../lib/errors";
import { userRepository } from "../repositories/userRepository";

export type RegisterInput = {
  email: string;
  password: string;
  agreed_to_terms: boolean;
  agreed_to_privacy: boolean;
};

export type RegisterResult = {
  user_id: string;
  email: string;
  status: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function registerUser(input: RegisterInput): RegisterResult {
  if (!input.agreed_to_terms || !input.agreed_to_privacy) {
    throw new AppError({
      statusCode: 400,
      code: "terms_not_accepted",
      message: "Terms and privacy policy must be accepted"
    });
  }

  const normalizedEmail = normalizeEmail(input.email);

  if (userRepository.findByEmail(normalizedEmail)) {
    throw new AppError({
      statusCode: 409,
      code: "duplicate_email",
      message: "Email already registered"
    });
  }

  const salt = randomUUID();
  const passwordHash = `${salt}:${scryptSync(input.password, salt, 64).toString("hex")}`;

  const user = userRepository.create({
    id: randomUUID(),
    email: normalizedEmail,
    passwordHash,
    status: "pending_verification",
    createdAt: new Date()
  });

  return {
    user_id: user.id,
    email: user.email,
    status: user.status
  };
}
