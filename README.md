# TypeScript Effect Starter Template

Vite+ (`vp`) fullstack TypeScript starter centered on Effect v4 beta conventions.

## Vite+ positioning

This repository uses Vite+ as the unified workflow entrypoint:

- https://viteplus.dev/guide/

All documented flows are `vp`-first.

## Prerequisites

- `vp` installed and available on PATH
- Node version from [.nvmrc](/Users/erikwiberg/work/typescript-effect-template/.nvmrc)

## Quick start

```bash
vp install
vp run dev
```

## Repository layout

```text
.
├─ apps/
│  ├─ web/                 # Framework-agnostic Vite app
│  └─ api/                 # Effect v4 HttpApi server
├─ packages/
│  ├─ shared/
│  └─ config/
├─ tests/
│  └─ e2e/                 # Playwright Chromium tests
├─ repos/
│  └─ effect-smol/         # Vendored reference repo (read-only)
└─ .github/workflows/ci.yml
```

## Quality gates

- `vp run check` is a required pre-merge gate.
- Lint warnings fail by default through `vp lint` / `vp check` (Oxlint via Vite+).
- `vp run test:e2e` runs Chromium-only Playwright by default.

## Tested versions matrix

| Component | Version |
|---|---|
| `vite` | `7.3.2` |
| `effect` | `4.0.0-beta.66` |
| `@effect/platform-node` | `4.0.0-beta.66` |
| `@effect/language-service` | `0.85.1` |
| `@playwright/test` | `1.59.1` |
| `typescript` | `5.9.3` |
| `pnpm` (`packageManager`) | `10.17.1` |

## Effect v4 beta disclaimer

This template tracks Effect v4 beta. APIs may evolve. For implementation idioms, prioritize:

- [repos/effect-smol](/Users/erikwiberg/work/typescript-effect-template/repos/effect-smol)
- [docs/effect-devtools.md](/Users/erikwiberg/work/typescript-effect-template/docs/effect-devtools.md)
- [docs/vendored-repositories.md](/Users/erikwiberg/work/typescript-effect-template/docs/vendored-repositories.md)

## Command contract

Run from repository root:

- `vp run dev`
- `vp run check`
- `vp run test`
- `vp run build`
- `vp run test:e2e`
- `vp run test:e2e:smoke`
- `vp run deps:check`

Notes:

- Use `vp run build` for this monorepo starter. `vp build` is the built-in single-app Vite build command and expects a root `index.html`.

## Local flow equivalent to CI

```bash
vp install
vp run check
vp run test
API_PORT=3737 vp run --filter @template/api dev &
API_PID=$!
sleep 3
API_PORT=3737 vp run --filter @template/api smoke
kill $API_PID
vp run test:e2e
```
