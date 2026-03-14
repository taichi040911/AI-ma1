import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../app.js";
import { users, otpStore, otpLastSent } from "../routes/auth.js";

// Reset in-memory stores before each test
beforeEach(() => {
  users.clear();
  otpStore.clear();
  otpLastSent.clear();
});

// ─── AUTH-001: POST /auth/register ──────────────────────────────────────────

describe("POST /auth/register (AUTH-001)", () => {
  const validBody = {
    email: "test@example.com",
    password: "Secret123",
    agreed_to_terms: true,
    agreed_to_privacy: true,
  };

  it("returns 200 with user data on successful registration", async () => {
    const res = await request(app).post("/auth/register").send(validBody);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("test@example.com");
    expect(res.body.data.user_id).toBeTruthy();
    expect(res.body.data.status).toBe("pending_verification");
  });

  it("returns 409 when email is already registered", async () => {
    await request(app).post("/auth/register").send(validBody);
    const res = await request(app).post("/auth/register").send(validBody);
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/already registered/);
  });

  it("returns 409 for duplicate email regardless of case", async () => {
    await request(app).post("/auth/register").send(validBody);
    const res = await request(app)
      .post("/auth/register")
      .send({ ...validBody, email: "TEST@EXAMPLE.COM" });
    expect(res.status).toBe(409);
  });

  it("returns 422 when email is missing", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email: _email, ...body } = validBody;
    const res = await request(app).post("/auth/register").send(body);
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it("returns 422 when password is missing", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...body } = validBody;
    const res = await request(app).post("/auth/register").send(body);
    expect(res.status).toBe(422);
  });

  it("returns 422 when agreed_to_terms is false", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ ...validBody, agreed_to_terms: false });
    expect(res.status).toBe(422);
  });

  it("returns 422 when agreed_to_privacy is false", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ ...validBody, agreed_to_privacy: false });
    expect(res.status).toBe(422);
  });

  it("returns 422 for invalid email format", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ ...validBody, email: "not-an-email" });
    expect(res.status).toBe(422);
  });
});

// ─── AUTH-003: POST /auth/send-otp ──────────────────────────────────────────

describe("POST /auth/send-otp (AUTH-003)", () => {
  const validBody = {
    channel: "email",
    destination: "user@example.com",
  };

  it("returns 200 with sent=true and expires_in_seconds", async () => {
    const res = await request(app).post("/auth/send-otp").send(validBody);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.sent).toBe(true);
    expect(typeof res.body.data.expires_in_seconds).toBe("number");
    expect(res.body.data.expires_in_seconds).toBeGreaterThan(0);
  });

  it("returns 200 for sms channel", async () => {
    const res = await request(app)
      .post("/auth/send-otp")
      .send({ channel: "sms", destination: "+819012345678" });
    expect(res.status).toBe(200);
    expect(res.body.data.sent).toBe(true);
  });

  it("returns 429 on second request within rate-limit window", async () => {
    await request(app).post("/auth/send-otp").send(validBody);
    const res = await request(app).post("/auth/send-otp").send(validBody);
    expect(res.status).toBe(429);
    expect(res.body.success).toBe(false);
    expect(typeof res.body.retry_after_seconds).toBe("number");
  });

  it("returns 422 when channel is invalid", async () => {
    const res = await request(app)
      .post("/auth/send-otp")
      .send({ channel: "push", destination: "test@example.com" });
    expect(res.status).toBe(422);
  });

  it("returns 422 when destination is missing", async () => {
    const res = await request(app)
      .post("/auth/send-otp")
      .send({ channel: "email" });
    expect(res.status).toBe(422);
  });

  it("allows resend after rate-limit window passes", async () => {
    // First send
    await request(app).post("/auth/send-otp").send(validBody);
    // Clear the rate-limit record to simulate time passing
    otpLastSent.delete("email:user@example.com");
    const res = await request(app).post("/auth/send-otp").send(validBody);
    expect(res.status).toBe(200);
    expect(res.body.data.sent).toBe(true);
  });
});
