import { randomInt, randomUUID, scryptSync } from "crypto";
import { AppError } from "../lib/errors";
import { otpRepository, type OtpChannel } from "../repositories/otpRepository";
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

export type SendOtpInput = {
  channel: OtpChannel;
  destination: string;
};

export type SendOtpResult = {
  sent: boolean;
  expires_in_seconds: number;
};

const OTP_TTL_SECONDS = 300;
const OTP_RESEND_COOLDOWN_SECONDS = 60;

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const E164_REGEX = /^\+[1-9]\d{7,14}$/;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeSms(destination: string) {
  return destination.replace(/[\s-]/g, "");
}

function validateDestination(channel: OtpChannel, destination: string) {
  if (channel === "email" && !EMAIL_REGEX.test(destination)) {
    throw new AppError({
      statusCode: 400,
      code: "invalid_destination",
      message: "Invalid email destination"
    });
  }

  if (channel === "sms" && !E164_REGEX.test(destination)) {
    throw new AppError({
      statusCode: 400,
      code: "invalid_destination",
      message: "Invalid phone destination"
    });
  }
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

export function sendOtp(input: SendOtpInput): SendOtpResult {
  const normalizedDestination =
    input.channel === "email"
      ? normalizeEmail(input.destination)
      : normalizeSms(input.destination);

  validateDestination(input.channel, normalizedDestination);

  const now = Date.now();
  const existing = otpRepository.find(input.channel, normalizedDestination);

  if (existing && now - existing.lastSentAt < OTP_RESEND_COOLDOWN_SECONDS * 1000) {
    throw new AppError({
      statusCode: 429,
      code: "rate_limited",
      message: "OTP recently sent"
    });
  }

  const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
  const expiresAt = now + OTP_TTL_SECONDS * 1000;

  otpRepository.upsert({
    channel: input.channel,
    destination: normalizedDestination,
    code,
    expiresAt,
    lastSentAt: now
  });

  return {
    sent: true,
    expires_in_seconds: OTP_TTL_SECONDS
  };
}
