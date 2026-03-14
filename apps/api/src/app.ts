import Fastify, { type FastifyInstance, type FastifyServerOptions } from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import authRoutes from "./routes/auth";
import meRoutes from "./routes/me";
import { registerErrorHandler } from "./lib/errors";

export function buildApp(options: FastifyServerOptions = {}): FastifyInstance {
  const app = Fastify({ logger: true, ...options }).withTypeProvider<TypeBoxTypeProvider>();

  registerErrorHandler(app);

  app.register(authRoutes, { prefix: "/auth" });
  app.register(meRoutes, { prefix: "/me" });

  app.get("/health", async () => ({ ok: true }));

  return app;
}
