# TeamPolls — Architecture Overview

## Overview

TeamPolls is a team polling and decision-making platform built with Angular 22 (frontend) and NestJS 11 (backend) in a monorepo structure.

## Project Structure

```
2026-07-29-teampolls/
├── package.json              # Root workspace config (npm workspaces)
├── tsconfig.json             # Shared TypeScript config
├── apps/
│   ├── api/                  # NestJS 11 backend
│   │   ├── src/
│   │   │   ├── main.ts         # Bootstrap + Swagger + CORS
│   │   │   ├── app.module.ts   # Root module (TypeORM + feature modules)
│   │   │   ├── auth/           # JWT auth (register, login, me)
│   │   │   ├── users/          # User entity + service
│   │   │   ├── polls/          # Poll CRUD + close/reopen
│   │   │   ├── poll-options/   # Poll option entity
│   │   │   ├── votes/          # Vote casting + results
│   │   │   └── seed/           # Demo data seeder
│   │   ├── data/               # SQLite database files
│   │   └── dist/               # Compiled output
│   └── web/                  # Angular 22 frontend
│       └── src/
│           ├── main.ts         # Bootstrap
│           ├── styles.css      # Global styles + design tokens
│           └── app/
│               ├── app.ts / app.config.ts / app.routes.ts
│               ├── interfaces.ts
│               ├── interceptors/    # Auth interceptor
│               ├── guards/          # Auth guard
│               ├── services/        # AuthService, PollsService
│               ├── layouts/         # AuthLayout, DashboardLayout
│               └── pages/           # Login, Register, Dashboard, PollCreate, PollDetail
└── docs/
    ├── ARCHITECTURE.md
    ├── API.md
    └── FRONTEND.md
```

## Architectural Decisions

### Monorepo with npm Workspaces
- Hoisted dependencies reduce duplication
- Shared TypeScript config at root
- Independent build commands per app

### Database: SQLite (dev) / PostgreSQL (production)
- TypeORM with `better-sqlite3` for local development
- `synchronize: true` in dev for schema auto-creation
- Neon PostgreSQL ready (same TypeORM config, swap driver)

### Auth: JWT with Passport.js
- Stateless token authentication
- bcryptjs for password hashing
- 7-day token expiry
- Bearer token in Authorization header

### Frontend: Angular 22 Signal Components
- Zoneless change detection
- Standalone components with lazy loading
- Signal-based state in services and components
- Functional interceptors and guards
- The `@let` template variable syntax (Angular 22)

## Key Patterns

1. **State Triad**: Every data page uses `loading` / `error` / `items` signals
2. **Lazy Routes**: All page components use `loadComponent` with named exports
3. **API Contract**: All API responses return data directly (no wrapper envelope)
4. **Module Isolation**: Each backend domain has its own module with controller + service + entity

## Design System — "Coral Sky"

- **Primary**: `#e85d75` (coral)
- **Background**: `#f8f9fc` (light) / `#0f1117` (dark)
- **Surface**: `#ffffff` (light) / `#1e2030` (dark)
- **Dark mode**: CSS custom properties swapped via `data-theme` attribute
