import { assert, describe, it } from '@effect/vitest';
import { SqliteClient } from '@effect/sql-sqlite-node';
import { Context, Effect, Layer } from 'effect';
import { Reactivity } from 'effect/unstable/reactivity';
import { RpcGroup } from 'effect/unstable/rpc';
import { RpcClient, RpcTest } from 'effect/unstable/rpc';
import type { RpcClientError } from 'effect/unstable/rpc/RpcClientError';
import { TodoRpcs } from '@template/shared';
import { makeHealthRpcHandler } from '../src/features/health/health.js';
import { makeTodoRpcHandlers } from '../src/features/todos/rpc.js';
import { TodoRepository } from '../src/features/todos/repository.js';

const version = '0.1.0';

const TodoRpcHandlers = makeTodoRpcHandlers(makeHealthRpcHandler(version));

class TestApiClient extends Context.Service<
  TestApiClient,
  RpcClient.RpcClient<RpcGroup.Rpcs<typeof TodoRpcs>, RpcClientError>
>()('test/TestApiClient') {}

const IntegrationLayer = Layer.effect(TestApiClient)(
  RpcTest.makeClient(TodoRpcs).pipe(Effect.orDie),
).pipe(
  Layer.provide(TodoRpcHandlers),
  Layer.provide(TodoRepository.layer),
  Layer.provide(SqliteClient.layer({ filename: ':memory:' })),
  Layer.provide(Reactivity.layer),
);

describe('rpc integration', () => {
  it.effect('serves health rpc contract in-process', () =>
    Effect.gen(function* () {
      const client = yield* TestApiClient;
      const health = yield* client.health();
      assert.strictEqual(health.status, 'ok');
      assert.strictEqual(health.service, 'api');
      assert.strictEqual(health.version, version);
    }).pipe(Effect.provide(IntegrationLayer)),
  );
});
