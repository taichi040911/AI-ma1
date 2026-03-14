import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../app";

describe("GET /co-actions", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = buildApp({ logger: false });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("returns co-actions list", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/co-actions"
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.success).toBe(true);
    expect(body.data.items.length).toBeGreaterThan(0);
  });

  it("filters by difficulty", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/co-actions?difficulty=easy"
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.items).toHaveLength(2);
  });

  it("filters by mood and group_type", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/co-actions?mood=active&group_type=group"
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.items).toHaveLength(1);
    expect(body.data.items[0].title).toContain("ウォーキング");
  });

  it("filters by purpose", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/co-actions?purpose=work"
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.items).toHaveLength(1);
    expect(body.data.items[0].title).toContain("勉強会");
  });
});
