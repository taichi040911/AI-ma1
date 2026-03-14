import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../app";

describe("GET /me/current-state", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = buildApp({ logger: false });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("returns current state", async () => {
    const authHeader = { authorization: "Bearer user-42" };
    const start = await app.inject({
      method: "POST",
      url: "/ai/life-navigation/start",
      headers: authHeader
    });
    const startBody = start.json();

    await app.inject({
      method: "POST",
      url: "/ai/life-navigation/answer",
      payload: {
        session_id: startBody.data.session_id,
        question_code: startBody.data.first_question.code,
        answer_text: "散歩が楽しかった"
      }
    });

    const response = await app.inject({
      method: "GET",
      url: "/me/current-state",
      headers: authHeader
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.success).toBe(true);
    expect(body.data.current_mode).toBeTypeOf("string");
    expect(body.data.ai_summary).toContain("散歩");
  });
});
