import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../app";
import { userRepository } from "../repositories/userRepository";

describe("POST /auth/register", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = buildApp({ logger: false });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    userRepository.reset();
  });

  it("registers a user", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: {
        email: "user@example.com",
        password: "Password123!",
        agreed_to_terms: true,
        agreed_to_privacy: true
      }
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.success).toBe(true);
    expect(body.data.email).toBe("user@example.com");
    expect(body.data.user_id).toBeTypeOf("string");
  });

  it("rejects missing fields", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: {
        email: "missing@example.com",
        agreed_to_terms: true,
        agreed_to_privacy: true
      }
    });

    expect(response.statusCode).toBe(400);
  });

  it("rejects when terms are not accepted", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: {
        email: "terms@example.com",
        password: "Password123!",
        agreed_to_terms: false,
        agreed_to_privacy: true
      }
    });

    expect(response.statusCode).toBe(400);
    const body = response.json();
    expect(body.error.code).toBe("terms_not_accepted");
  });

  it("rejects duplicate email", async () => {
    await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: {
        email: "dup@example.com",
        password: "Password123!",
        agreed_to_terms: true,
        agreed_to_privacy: true
      }
    });

    const response = await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: {
        email: "dup@example.com",
        password: "Password123!",
        agreed_to_terms: true,
        agreed_to_privacy: true
      }
    });

    expect(response.statusCode).toBe(409);
    const body = response.json();
    expect(body.error.code).toBe("duplicate_email");
  });
});
