import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../app";

describe("GET /ai/weekly-plan", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = buildApp({ logger: false });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("returns weekly plan", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/ai/weekly-plan"
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.success).toBe(true);
    expect(body.data.weekly_theme).toBeTypeOf("string");
    expect(Array.isArray(body.data.steps)).toBe(true);
  });
});
