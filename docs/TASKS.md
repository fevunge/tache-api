# TASKS — tache-api

Work top to bottom. One task at a time. Tag meaning (see AGENTS.md "Learning mode"):
`[AGENT]` agent implements · `[OWNER]` owner implements, agent only teaches and reviews.

Suggested pace: 1 phase per half-day to day. Skip nothing; later phases assume earlier ones.

## Phase 0 — Setup

- [ ] T0.1 `[AGENT]` Init project: pnpm, TS strict, ESM, Biome, Vitest, scripts from AGENTS.md
- [ ] T0.2 `[AGENT]` `docker-compose.yml` with PostgreSQL (dev + `tache_test` database)
- [ ] T0.3 `[AGENT]` `src/config`: env parsing with Zod, fail fast on bad config
- [ ] T0.4 `[AGENT]` Hono app with `GET /health` + integration test via `app.request`

## Phase 1 — Domain and use cases (no HTTP, no DB yet)

Goal: the heart of the system works and is tested in memory.

- [ ] T1.1 `[OWNER]` `Result<T, E>` type + helpers (`ok`, `err`) using a discriminated union
- [ ] T1.2 `[OWNER]` Branded `TaskId` and Zod schemas for `Task`, `CreateTaskInput`, `UpdateTaskInput`; derive types with `z.infer`
- [ ] T1.3 `[OWNER]` Domain errors as a discriminated union (`ValidationError`, `NotFoundError`)
- [ ] T1.4 `[AGENT]` `TaskRepository` port + `InMemoryTaskRepository` (for tests)
- [ ] T1.5 `[OWNER]` Use cases: `createTask`, `getTask`, `updateTask`, `deleteTask`, `markDone` (completedAt rule)
- [ ] T1.6 `[OWNER]` Use case `listTasks` with filters and cursor pagination
- [ ] T1.7 `[AGENT]` Unit tests for all use cases (review T1.5/T1.6 first; report any missed rule)

## Phase 2 — HTTP layer (still in-memory)

- [ ] T2.1 `[AGENT]` Error mapping: domain errors → HTTP codes and the standard error body
- [ ] T2.2 `[OWNER]` Routes for create/get/update/delete/done with `@hono/zod-openapi`
- [ ] T2.3 `[OWNER]` `GET /v1/tasks` with query validation, filters, `nextCursor`
- [ ] T2.4 `[AGENT]` `GET /v1/openapi.json` + integration tests for every route

## Phase 3 — PostgreSQL with Drizzle

- [ ] T3.1 `[AGENT]` Drizzle schema (`users`, `api_keys`, `tasks`) + first migration
- [ ] T3.2 `[OWNER]` `DrizzleTaskRepository` implementing the port (types inferred from schema, no `any`)
- [ ] T3.3 `[AGENT]` Wire Drizzle in `main.ts`; integration tests against `tache_test` (clean DB between tests)
- [ ] T3.4 `[OWNER]` Make the same repository test suite run against both in-memory and Drizzle implementations (shared contract tests)

## Phase 4 — Authentication

- [ ] T4.1 `[AGENT]` Seed script: create a user and print a new API key once (store SHA-256 hash only)
- [ ] T4.2 `[OWNER]` Auth middleware: resolve user from Bearer key, reject missing/invalid/revoked; typed `c.get('user')`
- [ ] T4.3 `[AGENT]` Scope every repository query by `userId`; tests proving user A cannot read user B's task (404)

## Phase 5 — Hardening (V1 done after this)

- [ ] T5.1 `[AGENT]` Structured request logging middleware (no secrets)
- [ ] T5.2 `[AGENT]` `README.md`: setup, run, test, curl examples for each endpoint
- [ ] T5.3 `[OWNER]` Write `docs/DECISIONS.md`: 5 short ADRs (why Hono, Drizzle, Result type, hexagonal split, API-key auth)
- [ ] T5.4 `[OWNER]` Review pass: find one place where a type could be tighter (generics, `satisfies`, conditional type) and improve it

## Phase 6 — V2: AI via Ollama (only after Phase 5)

- [ ] T6.1 `[OWNER]` `AiAssistant` port in `domain/` (suggest priority, embed text)
- [ ] T6.2 `[AGENT]` Ollama adapter via `fetch` + a fake adapter for tests; `AI_UNAVAILABLE` mapping
- [ ] T6.3 `[OWNER]` `suggestPriority` use case; validate model output with Zod
- [ ] T6.4 `[OWNER]` Duplicate detection: embeddings, `task_embeddings` table, cosine similarity in TS
- [ ] T6.5 `[AGENT]` Endpoints + integration tests using the fake adapter
