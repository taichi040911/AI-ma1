import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../app";
import { otpRepository } from "../repositories/otpRepository";

describe("POST /auth/send-otp", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = buildApp({ logger: false });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    otpRepository.reset();
  });

  it("sends otp", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/auth/send-otp",
      payload: {
        channel: "email",
        destination: "user@example.com"
      }
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.success).toBe(true);
    expect(body.data.sent).toBe(true);
    expect(body.data.expires_in_seconds).toBe(300);
  });

  it("rejects invalid destination", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/auth/send-otp",
      payload: {
        channel: "email",
        destination: "not-an-email"
      }
    });

    expect(response.statusCode).toBe(400);
    const body = response.json();
    expect(body.error.code).toBe("invalid_destination");
  });

  it("rate limits resend", async () => {
    await app.inject({
      method: "POST",
      url: "/auth/send-otp",
      payload: {
        channel: "email",
        destination: "rate@example.com"
      }
    });

    const response = await app.inject({
      method: "POST",
      url: "/auth/send-otp",
      payload: {
        channel: "email",
        destination: "rate@example.com"
      }
    });

    expect(response.statusCode).toBe(429);
    const body = response.json();
    expect(body.error.code).toBe("rate_limited");
  });
});
