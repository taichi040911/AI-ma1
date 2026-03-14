import { buildApp } from "./app";

const app = buildApp();

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "0.0.0.0";

app
  .listen({ port, host })
  .then(() => {
    app.log.info(`API listening on ${host}:${port}`);
  })
  .catch((err) => {
    app.log.error(err, "Failed to start server");
    throw err;
  });
