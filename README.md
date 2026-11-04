# tache-api

Task management HTTP API built with TypeScript, Hono, PostgreSQL, Drizzle, and
Zod. The project is designed to provide a clean REST API for CLI and web
clients.

## Status

The project is being implemented incrementally. The current setup includes the
TypeScript/ESM toolchain, Vitest, Biome, the source/test directory structure,
and a PostgreSQL 18 Alpine container. The API contract and implementation plan
are documented in [`docs/SPEC.md`](docs/SPEC.md) and
[`docs/TASKS.md`](docs/TASKS.md).

## Requirements

- Node.js 26.9.0
- pnpm
- Docker and Docker Compose

## Getting started

Install dependencies:

```bash
pnpm install
```

Start PostgreSQL:

```bash
docker compose up -d
```

Copy the environment template and configure the application:

```bash
cp env.example .env
```

The application configuration uses these variables. `NODE_ENV`, `PORT`, and
`DATABASE_URL` are required and validated when the application starts:

| Variable | Description |
| --- | --- |
| `NODE_ENV` | `development`, `test`, or `production` |
| `PORT` | HTTP port from 1 to 65535 |
| `DATABASE_URL` | PostgreSQL connection string using `postgres://` or `postgresql://` |

Ollama variables are optional and reserved for V2. If either model is set,
`OLLAMA_URL` must also be set:

| Variable | Description |
| --- | --- |
| `OLLAMA_URL` | Ollama HTTP URL |
| `OLLAMA_MODEL` | Text-generation model |
| `OLLAMA_EMBED_MODEL` | Embedding model |

The Compose file accepts these database variables:

| Variable | Default |
| --- | --- |
| `POSTGRES_DB` | `tache` |
| `POSTGRES_USER` | `postgres` |
| `POSTGRES_PASSWORD` | `postgres` |
| `POSTGRES_PORT` | `5432` |

The environment parser in `src/config/env.ts` validates these values and throws
a descriptive error before the application can start when configuration is
missing or malformed.

## Commands

```bash
pnpm dev        # Start the API with hot reload
pnpm build      # Compile TypeScript to dist/
pnpm start      # Run the compiled API
pnpm typecheck  # Run TypeScript without emitting files
pnpm test       # Run Vitest once
```

## PostgreSQL

The development database runs in the `tache-postgres` container and stores its
data in the named `postgres-data` volume. To stop the container without
removing data:

```bash
docker compose down
```

To remove the container and its persisted database volume:

```bash
docker compose down -v
```

## API

The planned V1 API includes:

- `GET /health`
- Task creation, listing, retrieval, update, completion, and deletion under
  `/v1/tasks`
- `GET /v1/openapi.json`

All API details, validation rules, error responses, authentication, filtering,
and cursor pagination are defined in [`docs/SPEC.md`](docs/SPEC.md).

## Architecture

```text
src/
  domain/         Entities, value types, errors, and ports
  application/    Use cases
  adapters/
    http/         Hono routes and Zod schemas
    db/           Drizzle schema and repositories
    ai/           Ollama adapter (V2)
  config/         Environment parsing
  main.ts         Application wiring
tests/            Tests mirroring src/
```

The dependency direction is `domain` → `application` → `adapters`. Domain code
does not depend on frameworks or infrastructure.

## Scope

V1 covers task management, API-key authentication, OpenAPI documentation, and
PostgreSQL persistence. V2 adds optional local Ollama features for priority
suggestions and duplicate detection. CLI, web UI, teams, sharing, JWT/OAuth,
and deployment are outside the project scope.
