## What to build

Implement projection mapping for Seed Title Fixture to produce `Title Read Summary` (`titleId`, `titleNameLabel`, `modifiedAt`) with explicit canonical timestamp mapping.

Mapping notes for slice-1:
- `titleId` <- `PrimaryKey`
- `titleNameLabel` <- `Header txt id`
- `modifiedAt` <- `ModificationTimestamp`

Use a DTO/projection boundary (for example via Effect Schema) to parse raw fixture records into selected shape so legacy source field names do not leak into the ported application contract.

## Acceptance criteria

- [ ] Projection mapper emits exactly the Title Read Summary fields for slice-1.
- [ ] Canonical modified timestamp source is explicitly declared via projection mapping policy.
- [ ] Missing required summary fields trigger generation failure per Slice Field Completeness Rule.
- [ ] A schema-backed DTO/projection boundary transforms raw source records into selected contract shape.

## Blocked by

- ISSUE-002
