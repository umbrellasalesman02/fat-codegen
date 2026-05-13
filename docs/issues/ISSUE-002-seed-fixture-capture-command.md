## What to build

Add the Fixture Capture Path command contract for capturing a record by table name and id into a committed slice fixture, supporting dual fixture records.

Inspiration is available at 
- /Users/erikwiberg/dev/work/filemaker-task-api/services/odata-fat-export/ODataConnectionService.ts 
- /Users/erikwiberg/dev/work/filemaker-task-api/services/odata-cms/ODataClientService.ts

using "@proofkit/fmodata": "^0.1.0-alpha.20"

to connect to the Filemaker application

There is a .env in this repo root with credentials


## Acceptance criteria

- [x] A generic capture command accepts table name, id, and output fixture target.
- [x] Capture output stores both source record and projected record containers.
- [x] Capture failures are surfaced as diagnostics and do not block runtime path when a committed projected fixture already exists.
- [x] A basic `@proofkit/fmodata`-based source fetch adapter is wired behind the capture path (can be minimal, but not a permanent throw-only stub).

## Implementation notes

- Current status: done.
- Adapter status: `@proofkit/fmodata` fetch path is wired for table + `PrimaryKey` lookup via env-backed FileMaker OData connection.

## Blocked by

- ISSUE-001
