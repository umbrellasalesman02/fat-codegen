import { assert, describe, it } from '@effect/vitest';
import { Context, Effect, Layer } from 'effect';
import { RpcGroup } from 'effect/unstable/rpc';
import { RpcClient, RpcTest } from 'effect/unstable/rpc';
import type { RpcClientError } from 'effect/unstable/rpc/RpcClientError';
import { TitleRpcs } from '@template/shared';
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
      assert.strictEqual(summary.titleNameLabel, 'Seed Title Fixture');
    }).pipe(Effect.provide(IntegrationLayer)),
  );
});
