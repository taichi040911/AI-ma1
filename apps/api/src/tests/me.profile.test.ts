import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../app";
import { profileRepository } from "../repositories/profileRepository";

describe("PUT /me/profile", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = buildApp({ logger: false });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    profileRepository.reset();
  });

  it("updates profile when authorized", async () => {
    const response = await app.inject({
      method: "PUT",
      url: "/me/profile",
      headers: {
        authorization: "Bearer user-123"
      },
      payload: {
        nickname: "Taro",
        birth_date: "1995-04-01",
        gender: "male",
        prefecture: "Tokyo",
        city: "Shibuya",
        bio: "Hello"
      }
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.success).toBe(true);
    expect(body.data.updated).toBe(true);
    expect(body.data.profile.nickname).toBe("Taro");
  });

  it("rejects missing required fields", async () => {
    const response = await app.inject({
      method: "PUT",
      url: "/me/profile",
      headers: {
        authorization: "Bearer user-123"
      },
      payload: {
        birth_date: "1995-04-01",
        gender: "male",
        prefecture: "Tokyo"
      }
    });

    expect(response.statusCode).toBe(400);
  });

  it("rejects when unauthorized", async () => {
    const response = await app.inject({
      method: "PUT",
      url: "/me/profile",
      payload: {
        nickname: "Taro",
        birth_date: "1995-04-01",
        gender: "male",
        prefecture: "Tokyo"
      }
    });

    expect(response.statusCode).toBe(401);
  });
});
