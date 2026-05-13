## Problem Statement

The team needs a reliable way to start porting a large FileMaker application into runnable and testable code without getting blocked by full-system scope, live-source instability, or legacy schema sprawl. Today, there is no single implementation-ready specification for the first Generated Application Slice that aligns Structural Source inputs, projection curation, generated contracts, runtime behavior, and diagnostics.

## Solution

Deliver Slice-1 as a deterministic, read-only Title vertical slice anchored to one Seed Title Fixture (`9B433A0E-7EBC-435C-8A99-D966BC17BA30`). The slice includes a Fixture Capture Path for reproducible fixture acquisition and a Slice Runtime Path that serves generated outputs from committed projected fixtures only. The runtime exposes a single read contract for Title Read Summary (`titleId`, `titleNameLabel`, `modifiedAt`), with strict fail-fast behavior for unsupported required script semantics and clear typed scope errors for out-of-slice requests.

## User Stories

1. As a porting developer, I want a first Generated Application Slice with a narrow scope, so that we can validate the architecture before scaling.
2. As a porting developer, I want slice behavior to be deterministic from committed inputs, so that regressions are easy to detect.
3. As an API consumer, I want to fetch a Title Read Summary by ID, so that I can verify end-to-end generated contract flow.
4. As a web user, I want to view a Title Read Summary in a dedicated route, so that I can validate slice usability.
5. As a developer, I want out-of-slice requests to return `TitleNotInSliceScope`, so that scope boundaries are explicit.
6. As a developer, I want required summary fields to be all-or-nothing, so that partial outputs do not masquerade as success.
7. As a developer, I want unsupported required script semantics to fail generation, so that correctness gaps are visible early.
8. As a developer, I want diagnostics classified by Source Domain, so that triage maps to dependency layering.
9. As a developer, I want a fixture capture command by table name and ID, so that agents can acquire data quickly.
10. As a developer, I want fixture capture to store both source and projected records, so that mapping decisions remain auditable.
11. As a developer, I want runtime to consume projected records only, so that source coupling is minimized.
12. As a developer, I want fixture capture failures to be non-blocking when committed fixture projections exist, so that runtime progress is resilient.
13. As a developer, I want canonical modified timestamp mapping declared in projection config, so that contract names stay stable despite upstream variance.
14. As a maintainer, I want generated contracts isolated under generated ownership boundaries, so that app dependencies remain stable.
15. As a maintainer, I want committed seed snapshots to act as regression oracles, so that generator drift is detected immediately.
16. As a team, I want a clear done-gate for slice-1, so that completion is objective.

## Implementation Decisions

- Slice strategy uses Vertical Slice with Dependency Layering: Data Structure, then Reference Data, then Behavior Logic inside one slice.
- Slice-1 target is one Seed Title Fixture: `9B433A0E-7EBC-435C-8A99-D966BC17BA30`.
- Slice-1 output contract is Title Read Summary with exactly three required fields: `titleId`, `titleNameLabel`, `modifiedAt`.
- Slice-1 supports one endpoint behavior: get Title Read Summary by `titleId`.
- Non-seed IDs return typed domain error `TitleNotInSliceScope`.
- Web route for slice-1 must show explicit scope messaging on `TitleNotInSliceScope`.
- Required field resolution follows Slice Field Completeness Rule: missing any required field fails generation.
- Script support follows Minimal Script Semantics Scope: only semantics needed to derive the three summary fields are in scope.
- Unsupported required script semantics follow Unsupported Script Step Policy: fail-fast with structured diagnostics.
- Diagnostics must be Source Domain Diagnostics-classified (`Data Structure`, `Reference Data`, `Behavior Logic`).
- Fixture capture belongs to slice-1 as Fixture Capture Path, but runtime remains offline from live source systems.
- Fixture Capture Command Contract is generic: capture by table name, ID, and output fixture target.
- Fixture shape follows Dual Fixture Record: store `sourceRecord` and `projectionRecord`; runtime/generation consume `projectionRecord` only.
- Projection Layer owns canonical mapping decisions, including Canonical Modified Timestamp source declaration.
- Generated Contract Ownership remains boundary-safe: generator-owned contract artifacts are isolated and composed through stable shared interfaces.
- Deterministic regeneration is mandatory for generator-owned outputs and seed snapshots.

Planned deep modules:
- Fixture Capture Adapter: stable interface for acquiring source records by table+id, independent of live transport details.
- Projection Mapper: deterministic mapping from source records to projected records, with explicit field curation.
- Slice Generator Core: deterministic emission of slice contracts/artifacts plus diagnostics from projected inputs.
- Slice Runtime Adapter: thin boundary adapter exposing generated contract behavior to API and web.
- Diagnostic Classifier: maps failures into Source Domain categories with stable machine-readable shape.

## Testing Decisions

- Good tests assert external behavior and stable outputs, not internal implementation details.
- Test modules:
- Projection Mapper tests for required-field completeness and canonical timestamp mapping.
- Slice Generator Core tests for deterministic output and fail-fast unsupported semantics.
- Diagnostic Classifier tests for domain classification correctness.
- API integration tests for seed success path and `TitleNotInSliceScope` path.
- Web behavior tests for rendering summary and explicit scope messaging.
- Snapshot tests for seed fixture expected outputs.
- Prior art:
- Existing package and app test patterns under shared/config/api vitest suites.
- Existing repository quality gate with `vp run check` and `vp run test` as baseline, with `vp run test:e2e` when user-visible behavior changes.

## Out of Scope

- Multi-title support beyond the seed fixture.
- Mutation/write behavior.
- Broad script engine support outside semantics required for Title Read Summary.
- Runtime dependency on live OData/FileMaker systems.
- Full legacy field mapping from source systems.
- Large-scale domain expansion beyond first Title slice contract.

## Further Notes

- Structural Source remains immutable and provenance-aware.
- Progressive Field Curation remains the policy for adding new projected fields.
- This PRD is intentionally local-first and intended to be converted into issue-tracker work items in a later planning pass.
