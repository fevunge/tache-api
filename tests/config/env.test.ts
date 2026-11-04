import { describe, expect, it } from "vitest";
import { loadConfig } from "../../src/config/env.js";

const validEnv = {
  NODE_ENV: "test",
  PORT: "3000",
  DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/tache_test",
};

describe("loadConfig", () => {
  it("parses application and database configuration", () => {
    expect(loadConfig(validEnv)).toMatchObject({
      NODE_ENV: "test",
      PORT: 3000,
      DATABASE_URL: validEnv.DATABASE_URL,
      POSTGRES_DB: "tache",
      POSTGRES_USER: "postgres",
      POSTGRES_PASSWORD: "postgres",
      POSTGRES_PORT: 5432,
    });
  });

  it("fails fast with a clear error for invalid configuration", () => {
    expect(() => loadConfig({ ...validEnv, PORT: "not-a-port" })).toThrow(
      "Invalid environment configuration",
    );
  });

  it("requires the Ollama URL when an Ollama model is configured", () => {
    expect(() => loadConfig({ ...validEnv, OLLAMA_MODEL: "llama3.2" })).toThrow(
      "OLLAMA_URL is required",
    );
  });
});
