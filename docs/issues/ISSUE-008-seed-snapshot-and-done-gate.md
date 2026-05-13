## What to build

Add seed fixture snapshot regression checks and enforce the slice-1 done gate across generation, API, web, scope behavior, and quality gate validation.

## Acceptance criteria

- [ ] Seed fixture expected snapshot is committed and verified on regeneration.
- [ ] Slice-1 done gate covers seed success path, scope error path, and web visibility.
- [ ] Commit-time quality gate includes `vp run check` and `vp run test`, and `vp run test:e2e` when user-visible behavior changed.

## Blocked by

- ISSUE-005
- ISSUE-006
- ISSUE-007
