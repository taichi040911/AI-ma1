import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../app";

describe("GET /co-actions/{id}", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = buildApp({ logger: false });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("returns co-action detail", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/co-actions/2b1a3e30-4db5-4f5d-8dd0-1c5c53b6d101"
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.success).toBe(true);
    expect(body.data.action.title).toContain("カフェ");
    expect(body.data.matching_users.length).toBeGreaterThan(0);
  });

  it("returns 404 for missing co-action", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/co-actions/00000000-0000-0000-0000-000000000000"
    });

    expect(response.statusCode).toBe(404);
    const body = response.json();
    expect(body.error.code).toBe("co_action_not_found");
  });
});
