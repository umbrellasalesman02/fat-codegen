## What to build

Add the Fixture Capture Path command contract for capturing a record by table name and id into a committed slice fixture, supporting dual fixture records.

Inspiration is available at 
- /Users/erikwiberg/dev/work/filemaker-task-api/services/odata-fat-export/ODataConnectionService.ts 
- /Users/erikwiberg/dev/work/filemaker-task-api/services/odata-cms/ODataClientService.ts

using "@proofkit/fmodata": "^0.1.0-alpha.20"

to connect to the Filemaker application

There is a .env in this repo root with credentials


## Acceptance criteria

- [ ] A generic capture command accepts table name, id, and output fixture target.
- [ ] Capture output stores both source record and projected record containers.
- [ ] Capture failures are surfaced as diagnostics and do not block runtime path when a committed projected fixture already exists.

## Blocked by

- ISSUE-001
