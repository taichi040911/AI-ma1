import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../app";

describe("POST /ai/life-navigation/start", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = buildApp({ logger: false });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("starts a session", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/ai/life-navigation/start"
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.success).toBe(true);
    expect(body.data.session_id).toBeTypeOf("string");
    expect(body.data.first_question.code).toBeTypeOf("string");
  });
});
