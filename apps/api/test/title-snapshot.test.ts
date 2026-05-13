import { assert, describe, it } from '@effect/vitest';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Effect, Schema } from 'effect';
import { SEED_TITLE_ID, readTitleInSliceScope } from '../src/features/titles/slice.js';

const SEED_SUMMARY_SNAPSHOT_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../../',
  'source/fixtures/title-slice/seed-title-read-summary.snapshot.json',
);

describe('seed title snapshot regression', () => {
  it.effect('matches committed seed summary snapshot', () =>
    Effect.gen(function* () {
      const summary = yield* readTitleInSliceScope(SEED_TITLE_ID);
      const expectedRaw = yield* Effect.promise(() => readFile(SEED_SUMMARY_SNAPSHOT_PATH, 'utf8'));
      const expected = Schema.decodeUnknownSync(
        Schema.fromJsonString(
          Schema.Struct({
            titleId: Schema.String,
            titleNameLabel: Schema.String,
            modifiedAt: Schema.String,
          }),
        ),
      )(expectedRaw);

      assert.deepStrictEqual(
        {
          titleId: summary.titleId,
          titleNameLabel: summary.titleNameLabel,
          modifiedAt: summary.modifiedAt.toISOString(),
        },
        expected,
      );
    }),
  );
});
