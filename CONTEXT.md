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
The required pre-merge validation sequence: `vp run check`, `vp run test`, then `vp run test:e2e` (Chromium baseline), where `vp run check` is considered passing only when clean from both errors and warnings.
_Avoid_: ad hoc local-only checks, skipping E2E in done criteria

**Agent Startup Sequence**:
Read `CONTEXT.md`, then `AGENTS.md`; if the task touches Effect patterns, inspect `repos/effect-smol/LLMS.md` plus relevant `effect-smol` source and tests; apply the **Shared Contract Admission Rule** before editing `packages/shared`.
_Avoid_: editing before context loading, guessing Effect idioms from memory

**Agent Starting Point**:
`CONTEXT.md` as the canonical conceptual guide for coding-agent decisions.
_Avoid_: README (for conceptual grounding)

**Generated Application Slice**:
An independently runnable and testable vertical slice generated deterministically from the Structural Source.
_Avoid_: feature chunk, code fragment, ad hoc port piece

**Ingestion Pipeline**:
The reproducible flow from FileMaker "Save as XML" export through `fm-xml-export-exploder` that produces the Structural Source as generator input.
_Avoid_: manual prep step, one-off export process

**Generated Packages**:
Committed workspace packages under `packages/` produced by generators and treated as read-only by hand edits.
_Avoid_: ad hoc generated folder, mixed manual/generated module

**Deterministic Regeneration**:
Generator runs overwrite owned target files in place with stable output for the same input.
_Avoid_: manual merge step, timestamp-based output drift

**Source Domain**:
A top-level FileMaker source category used for porting: Data Structure, Behavior Logic, or Reference Data.
_Avoid_: random export section, technical bucket

**Data Structure Source Domain**:
Tables and table occurrences/relationships that define entity shape and traversal paths.
_Avoid_: script logic, UI workflow

**Reference Data Source Domain**:
Value lists and related lookup structures required by generated behavior.
_Avoid_: primary entity records, script bodies

**Behavior Logic Source Domain**:
Scripts and executable flow definitions that implement business behavior.
_Avoid_: static schema, static lookup-only definitions

**Vertical Slice with Dependency Layering**:
A Generated Application Slice may span multiple Source Domains, but within the slice it is built in order: Data Structure, then Reference Data, then Behavior Logic.
_Avoid_: all-schema-first waterfall, script-first generation

**Structural Source**:
`source/filemaker/funkis-authoring-tool/fm-xml-export-exploder-output/` metadata defining structure and behavior (tables, relationships, scripts, value lists) without full operational record data.
_Avoid_: production dataset snapshot, full table export

**Source Provenance Path**:
Canonical source path segments encode system, application, and extractor provenance for immutable structural input.
_Avoid_: anonymous dump folder, toolless source naming

**Projection Layer**:
A selective mapping layer that retrieves and reshapes only required runtime records (for example via OData) into slice-focused models, excluding legacy fields by default.
_Avoid_: mirror-all-fields integration, direct table passthrough

**Progressive Field Curation**:
Fields are added to slice projections only when required by a failing scenario, contract need, or script dependency, not preemptively.
_Avoid_: upfront full-field mapping, speculative schema inclusion

**Unsupported Script Step Policy**:
If a required script step is not supported, generation fails fast and emits structured diagnostics instead of producing partial runnable behavior.
_Avoid_: warn-and-stub, silent partial generation

**Generated Contract Ownership**:
Generator-owned boundary contract files live under `packages/shared/src/generated/*`, while hand-written shared files only compose or re-export those contracts for Application consumption.
_Avoid_: app imports of generated internals, mixed manual and generated contract files

**Slice Success Criterion**:
A Generated Application Slice is successful when a user can retrieve and view the targeted read-only domain output end-to-end through API and web using generated contracts, with fail-fast behavior for unsupported required script semantics.
_Avoid_: partial backend-only proof, silent fallback behavior

**Title Read Summary**:
The minimal read-only Title payload includes `titleId`, `titleNameLabel`, and `modifiedAt`.
_Avoid_: full title document payload, preemptive optional metadata

**Seed Title Fixture**:
The first Generated Application Slice targets one explicit Title fixture: `9B433A0E-7EBC-435C-8A99-D966BC17BA30`.
_Avoid_: arbitrary title selection in slice 1, multi-title scope expansion

**Canonical Modified Timestamp**:
`modifiedAt` is a projection-defined canonical timestamp field whose upstream source field is declared explicitly in slice configuration.
_Avoid_: implicit timestamp inference, source-field leakage into contracts

**Slice Field Completeness Rule**:
For a target fixture, all fields in the declared read summary must resolve; generation fails if any required field is missing.
_Avoid_: partial field emission, best-effort success state

**Slice Scope Error**:
Requests outside the current slice scope return a typed domain error (`TitleNotInSliceScope`) rather than generic not-found.
_Avoid_: ambiguous not-found responses during incremental rollout

**Slice Scope Visibility**:
The first slice exposes one title view route and shows explicit user-facing scope messaging when `TitleNotInSliceScope` is returned.
_Avoid_: hidden scope failures, transport-only error visibility

**Minimal Script Semantics Scope**:
Slice-1 supports only script semantics required to derive `Title Read Summary` fields for the Seed Title Fixture; all other encountered required semantics fail fast.
_Avoid_: broad script-engine ambition in slice 1, silent semantic omission

**Source Domain Diagnostics**:
Generation diagnostics classify failures by Source Domain (`Data Structure`, `Reference Data`, `Behavior Logic`) to support slice triage.
_Avoid_: undifferentiated error streams, layer-blind troubleshooting

**Seed Fixture Snapshot**:
Slice-1 commits expected output snapshots for the Seed Title Fixture (read payload and key diagnostics), and regeneration must match unless an intentional change is made.
_Avoid_: untracked generator drift, assertion-free regeneration

**Fixture Capture Path**:
A slice-local acquisition path captures fixture data (for example via OData by table name and id) into committed projection input used by generation.
_Avoid_: live-runtime dependency for slice proof, ad hoc manual fixture creation

**Slice Runtime Path**:
The slice runtime path serves generated outputs from committed fixture projections through contracts, API, and web without requiring live source connectivity.
_Avoid_: implicit runtime fetch from source systems, capture/runtime coupling

**Fixture Capture Command Contract**:
Fixture capture uses a generic command contract with explicit table name, record id, and output fixture target.
_Avoid_: table-specific capture scripts, hidden capture parameters

**Dual Fixture Record**:
Slice fixtures may store both captured source records and projected records, while runtime and generation consume projected records only.
_Avoid_: projected-only fixtures with no traceability, runtime dependence on raw records

**Projection DTO Boundary**:
A schema-backed projection DTO maps raw source fields (for example `PrimaryKey`, `Header txt id`, `ModificationTimestamp`) into stable application-facing names (for example `titleId`, `titleNameLabel`, `modifiedAt`).
_Avoid_: leaking legacy source field names into application contracts

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
- A **Generated Application Slice** is produced from the **Structural Source** and validated through the **Quality Gate**
- The **Ingestion Pipeline** produces the **Structural Source**, which is consumed to create a **Generated Application Slice**
- **Generated Packages** provide stable package boundaries consumed by **Application**s
- **Deterministic Regeneration** keeps generated outputs diffable and repeatable across runs
- A **Generated Application Slice** can include multiple **Source Domain**s
- In each **Vertical Slice with Dependency Layering**, **Data Structure Source Domain** precedes **Reference Data Source Domain**, which precedes **Behavior Logic Source Domain**
- **Structural Source** provides generator inputs for shape and behavior, while **Projection Layer** governs selective runtime data retrieval
- **Projection Layer** follows **Progressive Field Curation** to keep runtime scope intentional
- **Source Provenance Path** standardizes naming of immutable structural inputs
- **Unsupported Script Step Policy** preserves trust in generated outputs by preventing partial behavior emission
- **Generated Contract Ownership** keeps app dependencies stable while allowing generator internals to evolve
- **Slice Success Criterion** defines the minimum end-to-end proof for a Generated Application Slice
- **Title Read Summary** defines the minimum useful payload for the first Title slice
- **Seed Title Fixture** constrains the first slice to one deterministic title anchor
- **Canonical Modified Timestamp** keeps boundary contracts stable despite upstream field variance
- **Slice Field Completeness Rule** enforces binary success for required read payloads
- **Slice Scope Error** clarifies progressive-implementation boundaries at runtime
- **Slice Scope Visibility** ensures slice boundaries are observable in the web experience
- **Minimal Script Semantics Scope** aligns behavior support with the first slice contract
- **Source Domain Diagnostics** make failure triage align with dependency layering
- **Seed Fixture Snapshot** provides deterministic regression detection for slice evolution
- **Fixture Capture Path** enables reproducible fixture acquisition without runtime coupling
- **Slice Runtime Path** keeps slice behavior deterministic and environment-stable
- **Fixture Capture Command Contract** standardizes agent-driven fixture acquisition
- **Dual Fixture Record** preserves mapping traceability without expanding runtime coupling
- **Projection DTO Boundary** preserves stable naming across evolving source-field curation

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
- "meta programming" was too vague for planning and scope — resolved as **Generated Application Slice** for concrete delivery units.
- "input prep" was ambiguous between manual and automated workflow — resolved as **Ingestion Pipeline** with explicit stages.
- "generated output location" was unclear — resolved as **Generated Packages** under `packages/`.
- "regen strategy" was undecided between staging and direct writes — resolved as **Deterministic Regeneration** with in-place overwrite.
- "port sequencing" was ambiguous between phased domains and vertical delivery — resolved as **Vertical Slice with Dependency Layering**.
- "source data" was ambiguous between metadata exports and runtime records — resolved via **Structural Source** plus **Projection Layer**.
- "field coverage" was uncertain at kickoff — resolved via **Progressive Field Curation**.
- "source folder naming" was ambiguous — resolved via **Source Provenance Path** with `source/filemaker/funkis-authoring-tool/fm-xml-export-exploder-output/`.
- "unsupported script behavior" was ambiguous between stubbing and hard failure — resolved as **Unsupported Script Step Policy** with fail-fast diagnostics.
- "shared contract ownership" was ambiguous between generated and hand-edited files — resolved via **Generated Contract Ownership**.
- "first-slice done state" was ambiguous — resolved via **Slice Success Criterion**.
- "minimum title payload" was ambiguous — resolved as **Title Read Summary**.
- "initial title scope" was ambiguous between one and many titles — resolved as **Seed Title Fixture**.
- "modified timestamp source" was ambiguous across legacy fields — resolved as **Canonical Modified Timestamp**.
- "required field behavior" was ambiguous between strict and best-effort output — resolved as **Slice Field Completeness Rule**.
- "out-of-scope title request behavior" was ambiguous — resolved as **Slice Scope Error**.
- "scope boundary UX" was ambiguous — resolved as **Slice Scope Visibility**.
- "slice-1 script breadth" was ambiguous — resolved as **Minimal Script Semantics Scope**.
- "diagnostic triage axis" was ambiguous — resolved as **Source Domain Diagnostics**.
- "regression oracle for slice-1" was ambiguous — resolved as **Seed Fixture Snapshot**.
- "live data usage in slice-1" was ambiguous — resolved as **Fixture Capture Path** plus **Slice Runtime Path**.
- "fixture capture interface" was ambiguous — resolved as **Fixture Capture Command Contract**.
- "fixture storage shape" was ambiguous — resolved as **Dual Fixture Record**.
- "field naming boundary" was ambiguous between raw source and application contracts — resolved as **Projection DTO Boundary**.
