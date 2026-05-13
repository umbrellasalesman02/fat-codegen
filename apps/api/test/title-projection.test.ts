import { assert, describe, it } from '@effect/vitest';
import { Effect } from 'effect';
import {
  CANONICAL_MODIFIED_AT_SOURCE_FIELD,
  TitleProjectionError,
  mapSourceRecordToTitleReadSummary,
} from '../src/features/titles/projection.js';

describe('title projection mapper', () => {
  it.effect('maps source fields into Title Read Summary', () =>
    Effect.gen(function* () {
      const summary = yield* mapSourceRecordToTitleReadSummary({
        PrimaryKey: 'seed-id',
        'Header txt id': 'header-label-id',
        ModificationTimestamp: '2026-05-01T10:50:40Z',
      });

      assert.strictEqual(summary.titleId, 'seed-id');
      assert.strictEqual(summary.titleNameLabel, 'header-label-id');
      assert.strictEqual(summary.modifiedAt.toISOString(), '2026-05-01T10:50:40.000Z');
      assert.strictEqual(CANONICAL_MODIFIED_AT_SOURCE_FIELD, 'ModificationTimestamp');
    }),
  );

  it.effect('fails when required summary fields are missing', () =>
    Effect.gen(function* () {
      const error: TitleProjectionError = yield* Effect.flip(
        mapSourceRecordToTitleReadSummary({
          PrimaryKey: 'seed-id',
          ModificationTimestamp: '2026-05-01T10:50:40Z',
        }),
      );

      assert.isTrue(error instanceof TitleProjectionError);
      assert.strictEqual(error.reason, 'InvalidRecordShape');
    }),
  );
});
