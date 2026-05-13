import { assert, describe, expect, it } from '@effect/vitest';
import { Effect } from 'effect';
import { makeHealth, makeHealthEffect } from '../src/health.js';

describe('health helpers', () => {
  it('builds a health payload for pure usage', () => {
    const health = makeHealth('0.1.0');
    expect(health).toEqual({
      status: 'ok',
      service: 'api',
      version: '0.1.0',
    });
  });

  it.effect('builds a health payload in Effect context', () =>
    Effect.gen(function* () {
      const health = yield* makeHealthEffect('0.1.0');
      assert.deepStrictEqual(health, {
        status: 'ok',
        service: 'api',
        version: '0.1.0',
      });
    }),
  );
});
