import { NodeRuntime, NodeServices } from '@effect/platform-node';
import { Console, Effect } from 'effect';
import { Command, Flag } from 'effect/unstable/cli';
import { captureTitleSliceFixture } from './fixture-capture.js';
import { fetchSourceRecordFromFileMaker } from './filemaker-source-fetch.js';

const cli = Command.make(
  'capture-title-fixture',
  {
    tableName: Flag.string('table').pipe(Flag.withDescription('FileMaker table name')),
    recordId: Flag.string('id').pipe(Flag.withDescription('FileMaker PrimaryKey value')),
    outputFixturePath: Flag.string('out').pipe(
      Flag.withDescription('Output path for fixture JSON file'),
    ),
  },
  Effect.fn(function* ({ tableName, recordId, outputFixturePath }) {
    const result = yield* Effect.promise(() =>
      captureTitleSliceFixture(
        {
          tableName,
          recordId,
          outputFixturePath,
        },
        {
          fetchSourceRecord: fetchSourceRecordFromFileMaker,
          projectRecord: (sourceRecord) => sourceRecord,
        },
      ),
    );

    yield* Console.log(result);
  }),
).pipe(
  Command.withDescription('Capture a FileMaker record into a slice fixture with source+projection containers'),
);

Command.run(cli, { version: '0.1.0' }).pipe(
  Effect.provide(NodeServices.layer),
  NodeRuntime.runMain,
);
