# Agent Instructions

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
