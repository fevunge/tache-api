import { describe, expect, it } from "vitest";
import { createApp } from "../../../src/app.js";

describe("HTTP application", () => {
  it("returns a liveness response without authentication", async () => {
    const response = await createApp().request("/health");

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });
  });

  it("creates a user without returning the password", async () => {
    const response = await createApp().request("/v1/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "fevunge",
        email: "fevunge@example.com",
        password: "secret",
        firstName: "Fe",
        lastName: "Vunge",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toMatchObject({
      username: "fevunge",
      email: "fevunge@example.com",
      firstName: "Fe",
      lastName: "Vunge",
    });
    expect(body).not.toHaveProperty("password");
    expect(body).not.toHaveProperty("passwordHash");
  });

  it("rejects signup without required fields", async () => {
    const response = await createApp().request("/v1/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "fevunge" }),
    });

    expect(response.status).toBe(400);
  });
});
