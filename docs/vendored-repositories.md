# Vendoring External Repositories for Agent Context

This starter follows the Effect recommendation of vendoring important dependency source code so coding agents can inspect real implementation patterns locally.

Reference article:

- https://effect.website/blog/the-one-weird-git-trick-that-makes-coding-agents-more-effect-ive/

## Why

- Agents are more reliable when they can browse full source trees, tests, and module structure.
- `node_modules` is often compiled/flattened and less useful for pattern discovery.
- Local source exploration avoids fragmented web-snippet context.

## Policy

- Vendored code lives under `repos/`.
- Vendored code is read-only reference material.
- Application code must not import from `repos/`.

## Effect v4 Beta Note

This template targets Effect v4 beta patterns and should vendor `effect-smol` (not `effect`) by default.

## Add `effect-smol` as a subtree

```bash
git subtree add \
  --prefix=repos/effect-smol \
  https://github.com/Effect-TS/effect-smol.git \
  main \
  --squash
```

## Update `effect-smol` subtree

```bash
git subtree pull \
  --prefix=repos/effect-smol \
  https://github.com/Effect-TS/effect-smol.git \
  main \
  --squash
```

## Editor Noise Reduction (optional)

Exclude `repos/**` from auto-import/search/file watcher in editor settings so vendored source helps agents without polluting day-to-day editing.
