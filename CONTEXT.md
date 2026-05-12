# TypeScript Effect Template

A fullstack starter template for teams using TypeScript and Effect v4 beta, designed for both humans and coding agents. This context defines the canonical language for repository structure and cross-app type safety.

## Language

**Template Repository**:
The top-level monorepo that ships the default project structure, tooling, and policies.
_Avoid_: boilerplate, starter kit

**Application**:
A deployable runtime unit under `apps/` such as `web` or `api`.
_Avoid_: service (when discussing folder layout)

**Shared Contract**:
Boundary-only runtime-validated schemas and derived static types in `packages/shared` for data crossing Application boundaries.
_Avoid_: internal domain schemas, `packages/config`, shared utils, common types

**Shared Contract Admission Rule**:
Create or modify a **Shared Contract** only when all are true: data crosses an Application boundary, runtime validation is required at that boundary, and at least two consumers rely on the same shape.
_Avoid_: preemptive sharing, single-app-only schemas

**Tooling Configuration**:
Shared build, lint, and TypeScript configuration support in `packages/config` that does not define boundary data contracts.
_Avoid_: API schema package, shared contract package

**Reference Source**:
A vendored, read-only repository with central architectural authority for this template; it provides coding patterns but is never imported from runtime code.
_Avoid_: runtime dependency, editable source

**Effect Core Primitives**:
Effect v4 primitives are the foundation for type safety, testability through strongly typed Layer-based dependency injection, observability, and production-grade resilience patterns such as retries and rate limits.
_Avoid_: optional utility layer, framework-specific add-on

**Boundary Flow**:
`packages/shared` schema defines boundary data, `apps/api` decodes and encodes at HTTP boundaries with that schema, `apps/web` consumes a typed client derived from the same schema, and E2E tests assert behavior without duplicating payload shape definitions.
_Avoid_: duplicating boundary types per app, trusting unchecked JSON

**Quality Gate**:
The required pre-merge validation sequence: `vp run check`, `vp run test`, API smoke checks, then `vp run test:e2e` (Chromium baseline).
_Avoid_: ad hoc local-only checks, skipping smoke or E2E in done criteria

**Agent Startup Sequence**:
Read `CONTEXT.md`, then `AGENTS.md`; if the task touches Effect patterns, inspect `repos/effect-smol/LLMS.md` plus relevant `effect-smol` source and tests; apply the **Shared Contract Admission Rule** before editing `packages/shared`.
_Avoid_: editing before context loading, guessing Effect idioms from memory

**Agent Starting Point**:
`CONTEXT.md` as the canonical conceptual guide for coding-agent decisions.
_Avoid_: README (for conceptual grounding)

## Relationships

- A **Template Repository** contains multiple **Application**s
- **Application**s use the **Shared Contract** to exchange boundary data safely
- **Shared Contract Admission Rule** governs when boundary schemas belong in `packages/shared`
- **Tooling Configuration** supports repository consistency and is separate from **Shared Contract**
- **Boundary Flow** is the required path for end-to-end type safety across **Application**s
- Internal domain schemas remain owned by the **Application** that uses them
- **Quality Gate** defines the minimum completion bar for changes in the **Template Repository**
- **Reference Source** exists only for repositories with central architectural authority
- For this template, `repos/effect-smol` is the only **Reference Source**
- **Effect Core Primitives** drive the baseline architecture and operational patterns across **Application**s
- **Agent Startup Sequence** defines deterministic setup behavior before changes
- **Agent Starting Point** describes the concepts and boundaries of the **Template Repository**

## Folder Boundaries

- `apps/api` contains API-specific handlers, local domain logic, and internal schemas
- `apps/web` contains UI rendering and interaction logic
- `packages/shared` contains only boundary contracts and typed client surface
- `packages/config` contains only tooling configuration

## Example dialogue

> **Dev:** "Should we vendor another repo under `repos/` and treat it like `effect-smol`?"
> **Domain expert:** "Only if it has the same central architectural role; otherwise it is not a **Reference Source**."

## Flagged ambiguities

- "context" was used to mean both conceptual glossary and setup guide — resolved: conceptual glossary lives in **Agent Starting Point** (`CONTEXT.md`), setup stays in `README.md`.
- "shared" was used for both boundary contracts and internal reuse — resolved: **Shared Contract** is boundary-only.
- "vendored repo" was used as a generic category — resolved: only centrally authoritative repos are **Reference Source** entries, currently only `repos/effect-smol`.
