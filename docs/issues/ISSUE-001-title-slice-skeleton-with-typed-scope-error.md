## What to build

Create the first runnable Title slice skeleton that establishes slice scope boundaries and returns typed scope errors for out-of-scope title requests.

## Acceptance criteria

- [ ] Slice runtime can receive a title ID request and route it through a dedicated title read path.
- [ ] Non-seed title IDs return typed `TitleNotInSliceScope` behavior (not generic not-found).
- [ ] The skeleton is runnable end-to-end even before full projection/script support is completed.

## Blocked by

None - can start immediately.
