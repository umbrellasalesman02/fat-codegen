## What to build

Implement projection mapping for Seed Title Fixture to produce `Title Read Summary` (`titleId`, `titleNameLabel`, `modifiedAt`) with explicit canonical timestamp mapping.

## Acceptance criteria

- [ ] Projection mapper emits exactly the Title Read Summary fields for slice-1.
- [ ] Canonical modified timestamp source is explicitly declared via projection mapping policy.
- [ ] Missing required summary fields trigger generation failure per Slice Field Completeness Rule.

## Blocked by

- ISSUE-002
