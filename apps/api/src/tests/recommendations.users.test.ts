import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../app";

describe("GET /recommendations/users", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = buildApp({ logger: false });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("returns user recommendations", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/recommendations/users"
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.success).toBe(true);
    expect(body.data.items.length).toBeGreaterThan(0);
    expect(body.meta.total).toBe(body.data.items.length);
  });

  it("filters by purpose", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/recommendations/users?purpose=work"
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.items).toHaveLength(1);
    expect(body.data.items[0].purposes).toContain("work");
  });

  it("filters by prefecture", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/recommendations/users?prefecture=大阪"
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.items).toHaveLength(1);
    expect(body.data.items[0].prefecture).toBe("大阪");
  });
});
