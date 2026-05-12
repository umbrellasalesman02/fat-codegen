# TypeScript Effect Starter Template

Vite+ (`vp`) fullstack TypeScript starter centered on Effect v4 beta conventions.

## Vite+ terminology

This repository uses the term Vite+ as defined in the official guide:

- https://viteplus.dev/guide/

All documented workflows use `vp` commands.

## Prerequisites

- `vp` installed and available on PATH

## Quick start

```bash
vp install
vp dev
```

## Monorepo layout

```text
.
├─ apps/
│  ├─ web/
│  └─ api/
├─ packages/
│  ├─ shared/
│  └─ config/
├─ tests/
│  └─ e2e/
└─ repos/
   └─ effect-smol/
```

## Command contract

Run from repo root:

- `vp run dev`
- `vp run check`
- `vp run test`
- `vp run build`
- `vp run test:e2e`
- `vp run deps:check`

## Package manager policy

- `packageManager` is pinned to `pnpm@10.17.1` for deterministic installs.
- User workflow remains `vp`-first, even if you normally use npm.

## Current status

This is the shell for PLF1-123. App/runtime implementation slices come next.
