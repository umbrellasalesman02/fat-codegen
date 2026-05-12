# Effect v4 + Vite+ Fullstack Starter (v1) Spec

## 1. Goal

Provide a fast-iteration fullstack TypeScript starter template for coding agents, using:

- Vite+ (`vp`) as the unified toolchain entrypoint
- Effect v4 beta patterns from `effect-smol`
- Strict quality gates (`check`, tests, E2E)
- Minimal backend + minimal frontend integration

This template is intentionally minimal and easy to fork, with clear expansion tracks.

## 2. Terminology

In this template, "Vite+" means the unified toolkit described in:

- https://viteplus.dev/guide/

All developer workflows should be documented with `vp` commands.

## 3. Non-goals (v1)

- No auth
- No database
- No SSR
- No framework-specific frontend dependency in the core app
- No multi-browser Playwright in default CI

## 4. Target Users

Fullstack TypeScript engineers who want fast coding-agent iteration loops with deterministic checks and tests.

## 5. Monorepo Layout

```text
.
├─ apps/
│  ├─ web/                # Vite+ vanilla TS frontend (framework-agnostic)
│  └─ api/                # Minimal Effect v4 HTTP server
├─ packages/
│  ├─ shared/             # Shared Effect/domain/util modules
│  └─ config/             # Shared tsconfig/eslint/playwright presets if needed
├─ tests/
│  └─ e2e/                # Playwright tests (against web + api)
├─ .github/workflows/
│  └─ ci.yml
├─ tsconfig.base.json
├─ tsconfig.json
├─ package.json
└─ pnpm-workspace.yaml
```

## 6. Package Manager + Toolchain Policy

- Use Vite+ commands as the only documented workflow:
  - `vp install`
  - `vp dev`
  - `vp check`
  - `vp test`
  - `vp build`
- Standardize repository determinism with pinned pnpm via `packageManager`.
- Even for npm-first users, daily usage remains `vp ...`.

## 7. Effect v4 Versioning Policy

- Effect packages must be pinned to exact versions (no `^`, no `~`).
- Maintain a "tested versions" section in README:
  - `vite-plus`
  - Effect packages
  - Playwright
  - Node version used in CI
- Add `deps:check` script for visibility on updates.

Suggested script:

```json
{
  "scripts": {
    "deps:check": "vp outdated"
  }
}
```

## 8. TypeScript Baseline

Start from `effect-smol` tsconfig conventions and keep overrides minimal.

Source references:

- https://github.com/Effect-TS/effect-smol/blob/main/tsconfig.base.json
- https://github.com/Effect-TS/effect-smol/blob/main/tsconfig.json

Baseline requirements:

- `strict: true`
- `module: "NodeNext"`
- `verbatimModuleSyntax: true`
- `exactOptionalPropertyTypes: true`
- `noImplicitOverride: true`
- Effect language-service plugin enabled

Template-specific overrides should be explicit and local (for example browser `lib` in web tsconfig).

## 9. Lint/Check Policy

- `vp check` is the required quality gate before merge.
- CI fails on lint warnings (zero-warning policy).
- Any warning exceptions must be explicit and documented in config comments.

## 10. Backend Starter (apps/api)

- Use Effect v4 beta APIs with patterns aligned to `effect-smol`.
- Base server shape on:
  - https://github.com/Effect-TS/effect-smol/blob/main/ai-docs/src/51_http-server/10_basics.ts
- Minimum endpoint:
  - `GET /health` -> `200` JSON/text health response
- Keep startup/logging simple and visible.

## 11. Frontend Starter (apps/web)

- Framework-agnostic (vanilla TS) Vite+ app.
- One thin integration call to backend health endpoint.
- No UI framework required in core v1.

## 12. Playwright E2E Policy

- Playwright included by default for frontend work.
- Default project/browser in CI: `chromium` only (fast path).
- Multi-browser (`firefox`, `webkit`) as opt-in (manual or nightly workflow).

Minimum E2E assertions:

- Web app loads
- Health fetch succeeds
- Health status rendered/visible in UI

## 13. CI Contract (required)

Primary CI job order:

1. Setup Vite+ (recommended `voidzero-dev/setup-vp`)
2. `vp install`
3. `vp check`
4. `vp test`
5. API smoke check (`/health`)
6. Playwright E2E (chromium)

Fail fast behavior expected at each stage.

## 14. Developer Scripts (root)

Initial command surface (exact names can vary, semantics should not):

- `dev` -> run web + api dev processes
- `check` -> format + lint + typecheck (via Vite+)
- `test` -> unit/integration tests
- `test:e2e` -> Playwright Chromium
- `build` -> build all buildable workspaces
- `deps:check` -> show outdated packages

All run through `vp run <script>` where applicable.

## 15. README Requirements

README should include:

- Statement that this is a Vite+ starter (link to guide)
- Exact prerequisites (`vp` installed)
- Quick start (copy/paste command block)
- Repo layout explanation
- Quality gate policy (`vp check`, zero warnings)
- Tested versions matrix
- How to run E2E and CI-equivalent local flow
- Beta disclaimer for Effect v4 and update expectations

## 16. Expansion Tracks (post-v1)

- Add adapter tracks (`examples/react`, `examples/vue`, etc.) without changing core policy.
- Add `apps/api` advanced track (auth/db) separately from baseline.
- Add cross-browser CI workflow as optional/nightly.

## 17. Acceptance Criteria for v1

- Fresh clone to passing local loop using only documented `vp` commands
- `vp check` clean with zero warnings
- `vp test` passes
- `vp run test:e2e` passes in Chromium
- Web app successfully calls API `/health`
- CI mirrors local contract and passes on main branch

## 18. Vendored Effect Source for Agent Context

To improve coding-agent output quality, this template vendors Effect source code in-repo as reference material.

Reference:

- https://effect.website/blog/the-one-weird-git-trick-that-makes-coding-agents-more-effect-ive/

Policy for this template:

- Use `git subtree` (not submodule) under `repos/`.
- For Effect v4 beta work, vendor `effect-smol` under `repos/effect-smol`.
- Treat vendored repositories as read-only reference material.
- Never import runtime application code from `repos/*`.

Recommended commands:

```bash
git subtree add \
  --prefix=repos/effect-smol \
  https://github.com/Effect-TS/effect-smol.git \
  main \
  --squash
```

```bash
git subtree pull \
  --prefix=repos/effect-smol \
  https://github.com/Effect-TS/effect-smol.git \
  main \
  --squash
```

Editor ergonomics:

- Exclude `repos/**` from search, file watchers, and auto-import suggestions to reduce IDE noise.
