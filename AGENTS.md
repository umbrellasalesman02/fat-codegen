<!-- intent-skills:start -->
## Skill Loading

Before substantial work:
- Skill check: run `pnpm dlx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `pnpm dlx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

# Agent Instructions

For domain language, read `CONTEXT.md`.

Do not treat `README.md` as the conceptual source-of-truth for architecture decisions, it's for human developers onboarding to the repository.

## Core Agent Loop (After Each Unit of Work)

Run from repository root unless a narrower scope is explicitly requested:

1. `vp run check`
2. `vp run test`
3. If backend/API behavior changed or user-visible behavior changed, run: `vp run test:e2e`

When time is constrained, at minimum run `vp run check` and explain any skipped gates.
Treat `vp run check` as passing only when it is clean from both errors and warnings.

## Vendored Repositories

This project vendors external repositories under `repos/` as read-only reference material for coding agents.

- Use vendored repositories to learn idiomatic patterns for related libraries.
- Prefer vendored source patterns over guesses or web snippets.
- Do not edit files under `repos/` unless explicitly asked.
- Do not import from `repos/`; import from normal package dependencies.

## Effect v4 Beta Reference

When writing Effect code, inspect `repos/effect-smol/` first.

- `repos/effect-smol/` is the source-of-truth reference for Effect v4 beta idioms in this template.
- Prefer patterns from implementation + tests in `effect-smol` over outdated docs/examples.
- If present, read `repos/effect-smol/LLMS.md` before implementing non-trivial Effect code.

## Pattern Files

Agents may create focused reference notes in `agent-patterns/` to avoid relearning repeated patterns.

Example:

- `agent-patterns/effect-schema.md`
- `agent-patterns/effect-http-server.md`
