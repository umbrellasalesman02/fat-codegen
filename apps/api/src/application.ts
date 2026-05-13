import { NodeHttpServer, NodeRuntime } from '@effect/platform-node';
import { SqliteClient } from '@effect/sql-sqlite-node';
import { Effect, Layer } from 'effect';
import { HttpRouter } from 'effect/unstable/http';
import { Reactivity } from 'effect/unstable/reactivity';
import { RpcServer, RpcSerialization } from 'effect/unstable/rpc';
import { mkdirSync } from 'node:fs';
import { createServer } from 'node:http';
import { loadApiConfig } from '@template/config';
import { TodoRpcs } from '@template/shared';
import { makeHealthRoute, makeHealthRpcHandler } from './features/health/health.js';
import { makeTodoRpcHandlers } from './features/todos/rpc.js';
import { TodoRepository } from './features/todos/repository.js';

const version = '0.1.0';

const makeSqliteLayer = (configuredDbPath: string) => {
  if (configuredDbPath !== ':memory:' && configuredDbPath.includes('/')) {
    mkdirSync(configuredDbPath.slice(0, configuredDbPath.lastIndexOf('/')), { recursive: true });
  }
  return SqliteClient.layer({ filename: configuredDbPath });
};

export type ApiApplicationOptions = {
  readonly sqliteLayer?: Layer.Layer<SqliteClient.SqliteClient>;
};

export const makeRpcLayer = (options?: ApiApplicationOptions) => {
  const todoRpcHandlers = makeTodoRpcHandlers(makeHealthRpcHandler(version));
  return todoRpcHandlers.pipe(
    Layer.provide(TodoRepository.layer),
    Layer.provide(options?.sqliteLayer ?? makeSqliteLayer('.data/todos.sqlite')),
    Layer.provide(Reactivity.layer),
  );
};

export const makeLayer = (
  config: { readonly host: string; readonly port: number },
  options?: ApiApplicationOptions,
) => {
  const todoRpcServer = RpcServer.layer(TodoRpcs).pipe(Layer.provide(makeRpcLayer(options)));

  const rpcProtocol = RpcServer.layerProtocolHttp({ path: '/rpc' }).pipe(
    Layer.provide(HttpRouter.layer),
  );
  const healthRoute = makeHealthRoute(version);
  const httpRoutes = Layer.mergeAll(rpcProtocol, healthRoute);

  return todoRpcServer.pipe(
    Layer.provideMerge(httpRoutes),
    Layer.provide(HttpRouter.serve(httpRoutes)),
    Layer.provide(HttpRouter.layer),
    Layer.provide(NodeHttpServer.layer(createServer, { port: config.port, host: config.host })),
    Layer.provide(RpcSerialization.layerNdjson),
  );
};

export const run = (options?: ApiApplicationOptions) =>
  Effect.gen(function* () {
    const config = yield* loadApiConfig();
    const sqliteLayer = options?.sqliteLayer ?? makeSqliteLayer(config.todoDbPath.trim());
    const appLayer = makeLayer({ host: config.host, port: config.port }, { sqliteLayer });
    return yield* Layer.launch(appLayer);
  }).pipe(NodeRuntime.runMain);
