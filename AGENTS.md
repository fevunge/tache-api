# AGENTS.md — tache-api

Task management HTTP API. TypeScript + Hono + Zod + Drizzle + PostgreSQL.
Single user-facing goal: a clean, well-tested REST API that any client (CLI, web) can use.
The owner is **learning** TypeScript through this project. Read "Learning mode" below.

## Language

- Code, comments, commits, docs: **English**.
- Replies and explanations to the owner: **Portuguese**.

## Commands (run these, do not invent others)

```
pnpm dev            # start API with hot reload
pnpm test           # vitest, run once
pnpm typecheck      # tsc --noEmit
pnpm lint           # biome check
pnpm db:generate    # drizzle-kit generate (create migration)
pnpm db:migrate     # apply migrations
docker compose up -d   # start PostgreSQL
```

If a script above does not exist yet, creating it is part of the current task.

## Stack (decided — do not swap or add alternatives)

- Node 26.9.0, ESM, TypeScript `strict: true`, pnpm
- Hono + `@hono/node-server` (HTTP), `@hono/zod-openapi` (contract)
- Zod (validation, types are inferred from schemas)
- Drizzle ORM + drizzle-kit, PostgreSQL (docker compose)
- Vitest (tests), Biome (lint + format)
- V2 only: Ollama over HTTP (`fetch`, no SDK)

Before using any library API: check the installed version's types in `node_modules`
or the official docs. **Never guess an API from memory.** If unsure, say so.

## Architecture

Dependency rule: `domain` imports nothing. `application` imports `domain` only.
`adapters` import `application` and `domain`. Never the other way.

```
src/
  domain/         entities, value types, errors, ports (interfaces)
  application/    use cases (one file per use case)
  adapters/
    http/         Hono routes, Zod schemas, error mapping
    db/           Drizzle schema + repository implementations
    ai/           Ollama adapter (V2)
  config/         env parsing (Zod), nothing else
  main.ts         wiring only: build adapters, inject into use cases, start server
tests/            mirrors src/
docs/             SPEC.md (what to build), TASKS.md (current work)
```

- Use cases receive their ports as constructor/function arguments. No global state.
- Routes contain no business logic: parse input → call use case → map result to HTTP.

## Conventions

- Expected failures are values, not exceptions. Use `Result<T, E>` with a
  discriminated-union error type. Throw only for bugs.
- IDs are branded types (`TaskId`), not bare `string`.
- Types come from Zod: `type X = z.infer<typeof XSchema>`. Do not duplicate them by hand.
- No `any`. No `as` casts unless commented with why. Prefer `satisfies`.
- Files: `kebab-case.ts`. One use case per file. Named exports only.
- Every use case has a unit test using an in-memory repository.
- Every route has at least one integration test using `app.request(...)`.

Example of the expected use case shape:

```ts
export const createTask =
  (deps: { tasks: TaskRepository; clock: Clock }) =>
  async (input: CreateTaskInput): Promise<Result<Task, ValidationError>> => {
    // ...
  };
```

## How to work

1. Work on **one task** from `docs/TASKS.md` at a time. The owner will name it (e.g. "do T2.3").
2. Before coding, write a plan of 3-5 lines, then proceed. Only stop to ask if
   the task is ambiguous: ask **one** question, then wait.
3. Make the smallest change that completes the task. No refactors, renames,
   or "improvements" outside the task.
4. After each change run `pnpm typecheck && pnpm lint && pnpm test`.
   If anything fails, fix it before doing anything else.
5. Finish by listing: files changed, commands run, result. Then stop.
6. If you are stuck after two attempts, stop and explain what you tried.
   Do not keep guessing.

## Learning mode

Tasks in `docs/TASKS.md` are tagged:

- `[AGENT]` — you implement it (boilerplate, config, wiring, test scaffolding).
- `[OWNER]` — the owner implements it. You do **not** write the solution.
  Explain the concept in 5-10 lines, give hints and a skeleton with `TODO`s,
  then review what the owner wrote and point out concrete problems.

For `[AGENT]` tasks, end with 2-3 lines in Portuguese explaining the one
concept the owner should understand from what you wrote.
Never choose a new library or pattern silently. Propose it and wait.

## Hard rules

- Do not add dependencies without asking.
- Do not edit files outside the current task's scope.
- Do not change the architecture rule, the stack, or this file.
- Do not commit secrets. Config comes from env vars, validated in `src/config`.
- Do not invent endpoints, fields, or env vars that are not in `docs/SPEC.md`.
- Do not mark a task done if tests or typecheck fail.
- Do not start V2 (AI) tasks until every V1 task is done.

## Definition of done

- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test` all pass
- [ ] New behavior has tests (unit and/or integration)
- [ ] No new dependency, no `any`, no unexplained cast
- [ ] `docs/TASKS.md` checkbox ticked

## Read when needed (not every time)

- What to build: `docs/SPEC.md`
- What to do now: `docs/TASKS.md`
