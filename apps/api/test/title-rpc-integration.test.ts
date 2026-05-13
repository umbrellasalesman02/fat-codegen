import { assert, describe, it } from '@effect/vitest';
import { Context, Effect, Layer } from 'effect';
import { RpcGroup } from 'effect/unstable/rpc';
import { RpcClient, RpcTest } from 'effect/unstable/rpc';
import type { RpcClientError } from 'effect/unstable/rpc/RpcClientError';
import { TitleNotInSliceScope, TitleRpcs } from '@template/shared';
import { makeTitleRpcHandlers } from '../src/features/titles/rpc.js';
import { SEED_TITLE_ID } from '../src/features/titles/slice.js';

class TestTitleApiClient extends Context.Service<
  TestTitleApiClient,
  RpcClient.RpcClient<RpcGroup.Rpcs<typeof TitleRpcs>, RpcClientError>
>()('test/TestTitleApiClient') {}

const IntegrationLayer = Layer.effect(TestTitleApiClient)(
  RpcTest.makeClient(TitleRpcs).pipe(Effect.orDie),
).pipe(Layer.provide(makeTitleRpcHandlers()));

describe('title rpc integration', () => {
  it.effect('serves title reads through the title slice rpc path', () =>
    Effect.gen(function* () {
      const client = yield* TestTitleApiClient;
      const summary = yield* client.getTitleReadSummary({ titleId: SEED_TITLE_ID });

      assert.strictEqual(summary.titleId, SEED_TITLE_ID);
      assert.strictEqual(summary.titleNameLabel, '17976250-18D1-4894-92D9-45198AB5C309');
    }).pipe(Effect.provide(IntegrationLayer)),
  );

  it.effect('returns typed TitleNotInSliceScope for out-of-scope titles', () =>
    Effect.gen(function* () {
      const client = yield* TestTitleApiClient;
      const error = yield* Effect.flip(
        client.getTitleReadSummary({ titleId: 'not-in-slice' }),
      );

      if (!(error instanceof TitleNotInSliceScope)) {
        return yield* Effect.die(`Expected TitleNotInSliceScope but received ${String(error)}`);
      }
      assert.isTrue(error instanceof TitleNotInSliceScope);
      assert.strictEqual(error._tag, 'TitleNotInSliceScope');
      assert.strictEqual(error.seedTitleId, SEED_TITLE_ID);
    }).pipe(Effect.provide(IntegrationLayer)),
  );
});
