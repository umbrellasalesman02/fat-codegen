import { assert, describe, it } from '@effect/vitest';
import { Schema } from 'effect';
import { TitleNotInSliceScope, TitleReadSummary } from '../src/title-rpc.js';

describe('title rpc schemas', () => {
  it('decodes title read summary payload', () => {
    const decode = Schema.decodeUnknownSync(TitleReadSummary);
    const summary = decode({
      titleId: '9B433A0E-7EBC-435C-8A99-D966BC17BA30',
      titleNameLabel: 'Seed Title Fixture',
      modifiedAt: '2026-01-01T00:00:00.000Z',
    });

    assert.strictEqual(summary.titleNameLabel, 'Seed Title Fixture');
    assert.isTrue(summary.modifiedAt instanceof Date);
  });

  it('decodes typed scope error', () => {
    const decode = Schema.decodeUnknownSync(TitleNotInSliceScope);
    const error = decode({
      _tag: 'TitleNotInSliceScope',
      titleId: 'OTHER-ID',
      seedTitleId: '9B433A0E-7EBC-435C-8A99-D966BC17BA30',
    });

    assert.strictEqual(error._tag, 'TitleNotInSliceScope');
    assert.strictEqual(error.titleId, 'OTHER-ID');
  });
});
