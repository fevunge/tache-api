import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { signup } from "@application/auth/signup.js";
import { publicUserSchema, signupInputSchema } from "@domain/user/user-schema.js";

const signupRoute = createRoute({
  method: "post",
  path: "/v1/auth",
  tags: ["auth"],
  summary: "Create a user account",
  request: {
    body: {
      content: {
        "application/json": {
          schema: signupInputSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    201: {
      description: "User account created",
      content: {
        "application/json": {
          schema: publicUserSchema,
        },
      },
    },
  },
});

export const registerAuthRoutes = (
  app: OpenAPIHono,
  createSignup: ReturnType<typeof signup>,
): void => {
  app.openapi(signupRoute, async (c) => {
    const user = await createSignup(c.req.valid("json"));
    return c.json(user, 201);
  });
};
