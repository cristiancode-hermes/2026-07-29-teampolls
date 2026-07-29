# TeamPolls Frontend

## Tech Stack

- **Angular 22** — standalone components, zoneless change detection, signal-based state
- **TypeScript 6.0** — strict mode
- **CSS Custom Properties** — no Tailwind, pure CSS design system
- **@angular/build** — esbuild-based build system

## Key Features

### Pages

| Route | Component | Auth | Description |
|-------|-----------|------|-------------|
| `/login` | LoginPageComponent | No | Email + password sign-in |
| `/register` | RegisterPageComponent | No | Create account |
| `/dashboard` | DashboardPageComponent | Yes | List of polls |
| `/polls/new` | PollCreatePageComponent | Yes | Create a new poll |
| `/polls/:id` | PollDetailPageComponent | Yes | Vote + see results |

### Services

- **AuthService** — Handles registration, login, token storage, profile loading. Exposes `currentUser` signal.
- **PollsService** — CRUD operations for polls, voting, and results. All methods return `Observable`.

### Guards

- **authGuard** — Synchronous guard checking for a stored JWT token. Redirects to `/login` if missing.

### Interceptors

- **authInterceptor** — Automatically attaches the Bearer token to all `/api/` requests.

### State Management Pattern

Every data-fetching page uses three independent signals:
- `loading` — starts as `true`, set to `false` after response/error
- `error` — empty string means no error
- Various data signals (`polls`, `poll`, `results`)

Template rendering order:
1. `loading()` → spinner
2. `error()` → error message with retry button
3. Empty data → empty state with CTA
4. Normal data → content

### Component Architecture

- **Layout components** (AuthLayout, DashboardLayout) — provide the page shell with navigation
- **Page components** (Login, Register, Dashboard, PollCreate, PollDetail) — handle data loading and user interaction
- **No shared/presentational components** — kept simple for MVP scope

### Design System

CSS custom properties defined in `styles.css`:

```css
:root {
  --color-primary: #e85d75;
  --color-bg: #f8f9fc;
  --color-surface: #ffffff;
  --color-border: #e2e4ea;
  --color-ink: #1a1c2e;
  --color-muted: #6b7280;
  --color-danger: #ef4444;
  /* ... */
}
```

Dark mode toggles via `[data-theme="dark"]` selector on `<html>` element.

## Build

```bash
# Development
cd apps/web && ../../node_modules/.bin/ng serve

# Production build
npm run build:web
```
