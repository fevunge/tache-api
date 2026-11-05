import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "src"),
      "@adapters": resolve(import.meta.dirname, "src/adapters"),
      "@application": resolve(import.meta.dirname, "src/application"),
      "@config": resolve(import.meta.dirname, "src/config"),
      "@domain": resolve(import.meta.dirname, "src/domain"),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
