import { Router, Request, Response } from "express";
import { randomUUID } from "crypto";

const router = Router();

// ─── In-memory stores (replace with DB in production) ───────────────────────

interface User {
  id: string;
  email: string;
  passwordHash: string;
  status: string;
}

const users = new Map<string, User>(); // keyed by email

interface OtpRecord {
  code: string;
  expiresAt: number;
  attempts: number;
}

// keyed by "channel:destination"
const otpStore = new Map<string, OtpRecord>();

// Rate-limit tracker: last OTP send time per destination
const otpLastSent = new Map<string, number>();
const OTP_RATE_LIMIT_MS = 60_000; // 1 minute
const OTP_EXPIRES_SECONDS = 300; // 5 minutes

// ─── Helpers ────────────────────────────────────────────────────────────────

function hashPassword(password: string): string {
  // Simple hash placeholder — use bcrypt in production
  return Buffer.from(password).toString("base64");
}

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ─── POST /auth/register  (AUTH-001) ─────────────────────────────────────────

router.post("/register", (req: Request, res: Response) => {
  const { email, password, agreed_to_terms, agreed_to_privacy } =
    req.body as {
      email?: string;
      password?: string;
      agreed_to_terms?: boolean;
      agreed_to_privacy?: boolean;
    };

  // Required field validation
  if (!email || typeof email !== "string") {
    res.status(422).json({ success: false, error: "email is required" });
    return;
  }
  if (!password || typeof password !== "string") {
    res.status(422).json({ success: false, error: "password is required" });
    return;
  }
  if (agreed_to_terms !== true) {
    res
      .status(422)
      .json({ success: false, error: "agreed_to_terms must be true" });
    return;
  }
  if (agreed_to_privacy !== true) {
    res
      .status(422)
      .json({ success: false, error: "agreed_to_privacy must be true" });
    return;
  }

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(422).json({ success: false, error: "invalid email format" });
    return;
  }

  // Duplicate email check
  if (users.has(email.toLowerCase())) {
    res.status(409).json({ success: false, error: "email already registered" });
    return;
  }

  const user: User = {
    id: randomUUID(),
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    status: "pending_verification",
  };
  users.set(user.email, user);

  res.status(200).json({
    success: true,
    data: {
      user_id: user.id,
      email: user.email,
      status: user.status,
    },
  });
});

// ─── POST /auth/send-otp  (AUTH-003) ─────────────────────────────────────────

router.post("/send-otp", (req: Request, res: Response) => {
  const { channel, destination } = req.body as {
    channel?: string;
    destination?: string;
  };

  if (!channel || !["email", "sms"].includes(channel)) {
    res
      .status(422)
      .json({ success: false, error: "channel must be 'email' or 'sms'" });
    return;
  }
  if (!destination || typeof destination !== "string") {
    res.status(422).json({ success: false, error: "destination is required" });
    return;
  }

  // Rate limiting
  const rateKey = `${channel}:${destination}`;
  const lastSent = otpLastSent.get(rateKey);
  if (lastSent !== undefined && Date.now() - lastSent < OTP_RATE_LIMIT_MS) {
    const retryAfter = Math.ceil(
      (OTP_RATE_LIMIT_MS - (Date.now() - lastSent)) / 1000
    );
    res.status(429).json({
      success: false,
      error: "too many requests",
      retry_after_seconds: retryAfter,
    });
    return;
  }

  const code = generateOtp();
  otpStore.set(rateKey, {
    code,
    expiresAt: Date.now() + OTP_EXPIRES_SECONDS * 1000,
    attempts: 0,
  });
  otpLastSent.set(rateKey, Date.now());

  // In production, send code via email/SMS here.
  // Assumption: actual delivery is delegated to an external service.

  res.status(200).json({
    success: true,
    data: {
      sent: true,
      expires_in_seconds: OTP_EXPIRES_SECONDS,
    },
  });
});

export { router as authRouter };
export { users, otpStore, otpLastSent, OTP_RATE_LIMIT_MS, OTP_EXPIRES_SECONDS };
