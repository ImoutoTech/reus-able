# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`reus-able` is a pnpm monorepo of shared utility packages published under the `@reus-able` npm scope. All packages are in `packages/`.

## Build Commands

Each package is built independently from within its directory:

```bash
# @reus-able/nestjs (TypeScript → dist/, uses tsc-alias for path resolution)
cd packages/nestjs && pnpm build

# @reus-able/types (plain tsc)
cd packages/types && pnpm build

# @reus-able/const (dual CJS + ESM output)
cd packages/const && pnpm build

# @reus-able/sso-utils (Vite library build)
cd packages/sso-utils && pnpm build
```

`@reus-able/theme` has no build step — it ships raw CSS/SCSS source files directly.

There are no workspace-level build or test scripts.

## Package Architecture

### `@reus-able/nestjs`
NestJS utilities for Fastify-based backends. Organized under `common/`:

- **`guard/auth.guard.ts`** — JWT auth guard (`AuthGuard`). When no roles/permissions are required on a route, it still attempts to decode the token and attaches `request.user` silently. When roles/permissions are set, it enforces them. Uses `TOKEN_SECRET` env var via `ConfigService`.
- **`decorator/`** — `AuthRoles(...roles)` sets `roles` metadata; `PermissionGuard(...permissions)` sets `permissions` metadata; `UserParams` extracts `request.user` as `UserJwtPayload`.
- **`module/logger/`** — `LoggerModule` (global) provides `HLogger` via token `HLOGGER_TOKEN`. Uses Winston with console + daily-rotate-file (`log/h-YYYY-MM-DD.log`).
- **`module/redis/`** — `RedisModule` (global) provides `RedisService`. Reads `REDIS_HOST`, `REDIS_PORT`, `REDIS_USERNAME`, `REDIS_AUTHPASS`, `REDIS_DATABASE` from env.
- **`module/permission/`** — Abstract `PermissionService` (token `PERMISSION_SERVICE_TOKEN`). Applications must provide a concrete implementation to use `PermissionGuard`. The `AuthGuard` injects it as `@Optional()`.
- **`exceptions/`** — `BusinessException` extends `HttpException` and returns HTTP 200 with a business error code. `AllExceptionsFilter` catches everything else.
- **`interceptors/transform.interceptor.ts`** — Wraps all responses in `{ data, code: 0, msg: 'success' }`.
- **`middleware/fastifyCors.middleware.ts`** — Fastify CORS middleware.

Path alias `@/*` maps to the package root (configured in `tsconfig.json` + resolved by `tsc-alias` at build time).

Inter-package dependencies: `@reus-able/nestjs` → `@reus-able/const` + `@reus-able/types` (workspace:*).

### `@reus-able/types`
TypeScript types shared across packages:
- `UserRole` enum (`ADMIN = 0`, `USER = 1`)
- `UserJwtPayload` interface (`email`, `role`, `id`, `refresh`, `roles`)
- `AuthRoleType` (`'admin' | 'user' | 'refresh'`)
- `BusinessError` interface

### `@reus-able/const`
Shared constants, dual CJS/ESM output:
- `BUSINESS_ERROR_CODE` enum — error codes for auth and business errors
- `BUSINESS_ERROR_TEXT` — human-readable messages (Chinese) for each code

### `@reus-able/sso-utils`
Frontend OAuth utility, built with Vite as a library (ESM + UMD). Exports `UserAPI(ENV)` factory returning:
- `getUserInfo(token)` — GET `/oauth/user`
- `authorizeToken(code)` — POST `/oauth/token` with `client_id`, `client_secret`, `code`, `redirect_uri`
- `redirectSSO(blank?)` / `getRedirectLink()` — redirect to SSO authorize URL

`UserApiEnv` requires `SSO_URL`, `SSO_ID`, `SSO_REDIRECT` (and optional `SSO_SECRET`).

### `@reus-able/theme`
CSS/SCSS design system extracted from Applog. No build — raw source is published. Exports:
- `.` → `src/index.css` (all modules)
- `./tokens` → CSS custom properties (colors, fonts)
- `./article` → `.article-content` typography for rendered Markdown
- `./container` → `.common-page-container` responsive layout
- `./cover-image` → `.cover-block` shimmer skeleton + loaded image styles

## TypeScript Configuration

Root `tsconfig.base.json` sets shared compiler options. Individual packages extend it. Key settings: `module: commonjs`, `target: ES2021`, `experimentalDecorators: true`, `emitDecoratorMetadata: true`, `strictNullChecks: false`, `noImplicitAny: false`.

The `nestjs` package uses `paths: { "@/*": ["./*"] }` with `tsc-alias` to resolve `@/` imports after compilation.
