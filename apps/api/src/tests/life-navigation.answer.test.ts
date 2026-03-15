import { randomUUID } from "crypto";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../app";
import { lifeNavigationRepository } from "../repositories/lifeNavigationRepository";

describe("POST /ai/life-navigation/answer", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = buildApp({ logger: false });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    lifeNavigationRepository.reset();
  });

  it("accepts an answer and returns next question", async () => {
    const sessionId = randomUUID();
    const session = lifeNavigationRepository.createSession(sessionId);

    const response = await app.inject({
      method: "POST",
      url: "/ai/life-navigation/answer",
      payload: {
        session_id: session.id,
        question_code: "LN_Q1",
        answer_text: "test answer"
      }
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.success).toBe(true);
    expect(body.data.next_question.code).toBe("LN_Q2");
    expect(body.data.progress.total).toBe(3);
  });

  it("rejects invalid session", async () => {
    const missingSessionId = randomUUID();

    const response = await app.inject({
      method: "POST",
      url: "/ai/life-navigation/answer",
      payload: {
        session_id: missingSessionId,
        question_code: "LN_Q1",
        answer_text: "test"
      }
    });

    expect(response.statusCode).toBe(400);
    const body = response.json();
    expect(body.error.code).toBe("session_not_found");
  });

  it("rejects question mismatch", async () => {
    const sessionId = randomUUID();
    const session = lifeNavigationRepository.createSession(sessionId);

    const response = await app.inject({
      method: "POST",
      url: "/ai/life-navigation/answer",
      payload: {
        session_id: session.id,
        question_code: "LN_Q2",
        answer_text: "test"
      }
    });

    expect(response.statusCode).toBe(400);
    const body = response.json();
    expect(body.error.code).toBe("question_mismatch");
  });
});
