# FileMaker Codegen Port Workspace

Vite+ (`vp`) fullstack TypeScript workspace used to iteratively port a large FileMaker application into runnable and testable generated code.

## Repository intent

- Treat this repo as a code-generation workspace, not just a starter template.
- Use immutable structural input from:
  - `source/filemaker/funkis-authoring-tool/fm-xml-export-exploder-output/`
- Generate vertical slices that become runnable through `apps/api` and `apps/web`.
- Keep application boundaries stable through minimal contracts in `packages/shared`.

For canonical domain language and architectural decisions, see:

- [CONTEXT.md](/Users/erikwiberg/dev/work/filemaker-codegen/CONTEXT.md)
- [ADR 0001](/Users/erikwiberg/dev/work/filemaker-codegen/docs/adr/0001-generated-port-architecture.md)

## Vite+ positioning

This repository uses Vite+ as the unified workflow entrypoint:

- https://viteplus.dev/guide/

All documented flows are `vp`-first.

## Prerequisites

- `vp` installed and available on PATH
- Node version from [.nvmrc](/Users/erikwiberg/dev/work/filemaker-codegen/.nvmrc)

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
├─ source/
│  └─ filemaker/           # Immutable structural source inputs
├─ repos/
│  └─ effect-smol/         # Vendored reference repo (read-only)
└─ .github/workflows/ci.yml
```

## Quality gates

- `vp run check` is a required pre-merge gate.
- Lint warnings fail by default through `vp lint` / `vp check` (Oxlint via Vite+).
- `vp run test:e2e` runs Chromium-only Playwright by default.

## Tested versions matrix

| Component                  | Version         |
| -------------------------- | --------------- |
| `vite`                     | `7.3.2`         |
| `effect`                   | `4.0.0-beta.66` |
| `@effect/platform-node`    | `4.0.0-beta.66` |
| `@effect/language-service` | `0.85.1`        |
| `@playwright/test`         | `1.59.1`        |
| `typescript`               | `5.9.3`         |
| `pnpm` (`packageManager`)  | `10.17.1`       |

## Effect v4 beta disclaimer

This template tracks Effect v4 beta. APIs may evolve. For implementation idioms, prioritize:

- [repos/effect-smol](/Users/erikwiberg/dev/work/filemaker-codegen/repos/effect-smol)
- [docs/effect-devtools.md](/Users/erikwiberg/dev/work/filemaker-codegen/docs/effect-devtools.md)
- [docs/vendored-repositories.md](/Users/erikwiberg/dev/work/filemaker-codegen/docs/vendored-repositories.md)

## Command contract

Run from repository root:

- `vp run dev`
- `vp run check`
- `vp run test`
- `vp run build`
- `vp run test:e2e`
- `vp run deps:check`

Notes:

- Use `vp run build` for this monorepo starter. `vp build` is the built-in single-app Vite build command and expects a root `index.html`.

## Local flow equivalent to CI

```bash
vp install
vp run check
vp run test
vp run test:e2e
```
