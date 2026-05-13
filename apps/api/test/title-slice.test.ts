import { assert, describe, it } from '@effect/vitest';
import { Effect } from 'effect';
import { TitleNotInSliceScope } from '@template/shared';
import { SEED_TITLE_ID, readTitleInSliceScope } from '../src/features/titles/slice.js';

describe('title slice scope', () => {
  it.effect('returns skeleton read summary for seed title', () =>
    Effect.gen(function* () {
      const summary = yield* readTitleInSliceScope(SEED_TITLE_ID);
      assert.strictEqual(summary.titleId, SEED_TITLE_ID);
      assert.strictEqual(summary.titleNameLabel, '17976250-18D1-4894-92D9-45198AB5C309');
    }),
  );

  it.effect('returns typed TitleNotInSliceScope for non-seed title ids', () =>
    Effect.gen(function* () {
      const error: TitleNotInSliceScope = yield* Effect.flip(readTitleInSliceScope('not-seed-id'));
      assert.isTrue(error instanceof TitleNotInSliceScope);
      assert.strictEqual(error._tag, 'TitleNotInSliceScope');
      assert.strictEqual(error.titleId, 'not-seed-id');
      assert.strictEqual(error.seedTitleId, SEED_TITLE_ID);
    }),
  );
});
