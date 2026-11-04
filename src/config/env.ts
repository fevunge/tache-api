import { z } from "@hono/zod-openapi";

const portSchema = z
  .string()
  .trim()
  .min(1, "PORT is required")
  .transform(Number)
  .pipe(z.number().int().min(1).max(65535));

const databaseUrlSchema = z
  .string()
  .trim()
  .min(1, "DATABASE_URL is required")
  .url()
  .refine(
    (value) => value.startsWith("postgres://") || value.startsWith("postgresql://"),
    "DATABASE_URL must use the postgres or postgresql protocol",
  );

const environmentSchema = z.enum(["development", "test", "production"]);

const applicationEnvSchema = z.object({
  NODE_ENV: environmentSchema,
  PORT: portSchema,
  DATABASE_URL: databaseUrlSchema,
  OLLAMA_URL: z.string().trim().url().optional(),
  OLLAMA_MODEL: z.string().trim().min(1).optional(),
  OLLAMA_EMBED_MODEL: z.string().trim().min(1).optional(),
});

const databaseEnvSchema = z.object({
  POSTGRES_DB: z.string().trim().min(1).default("tache"),
  POSTGRES_USER: z.string().trim().min(1).default("postgres"),
  POSTGRES_PASSWORD: z.string().min(1).default("postgres"),
  POSTGRES_PORT: z.preprocess((value) => value ?? "5432", portSchema),
});

export type AppConfig = z.infer<typeof applicationEnvSchema> &
  z.infer<typeof databaseEnvSchema>;

export const loadConfig = (env: NodeJS.ProcessEnv = process.env): AppConfig => {
  const parsed = applicationEnvSchema.and(databaseEnvSchema).safeParse(env);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map(({ path, message }) => `${path.join(".") || "environment"}: ${message}`)
      .join("; ");

    throw new Error(`Invalid environment configuration: ${details}`);
  }

  const hasOllamaModel = Boolean(parsed.data.OLLAMA_MODEL);
  const hasOllamaEmbedModel = Boolean(parsed.data.OLLAMA_EMBED_MODEL);

  if ((hasOllamaModel || hasOllamaEmbedModel) && !parsed.data.OLLAMA_URL) {
    throw new Error(
      "Invalid environment configuration: OLLAMA_URL is required when an Ollama model is configured",
    );
  }

  return parsed.data;
};
