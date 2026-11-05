import { OpenAPIHono } from "@hono/zod-openapi";
import { registerAuthRoutes } from "@adapters/http/auth.js";
import { InMemoryUserRepository } from "@adapters/memory/user-repository.js";
import { signup } from "@application/auth/signup.js";

export const createApp = (): OpenAPIHono => {
  const app = new OpenAPIHono();
  const users = new InMemoryUserRepository();

  app.use("*", async (c, next) => {
    const startedAt = performance.now();
    await next();
    console.log(
      JSON.stringify({
        method: c.req.method,
        path: c.req.path,
        status: c.res.status,
        duration: Math.round(performance.now() - startedAt),
      }),
    );
  });

  app.get("/health", (c) => c.json({ status: "ok" }, 200));
  registerAuthRoutes(app, signup({ users }));

  app.doc("/v1/openapi.json", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "tache-api",
    },
  });

  return app;
};
