import { NodeHttpServer, NodeRuntime } from '@effect/platform-node';
import { SqliteClient } from '@effect/sql-sqlite-node';
import { Effect, Layer, Schema } from 'effect';
import { HttpRouter, HttpServerResponse } from 'effect/unstable/http';
import { Reactivity } from 'effect/unstable/reactivity';
import { RpcServer, RpcSerialization } from 'effect/unstable/rpc';
import { mkdirSync } from 'node:fs';
import { createServer } from 'node:http';
import { loadApiConfig } from '../../../packages/config/src/index.js';
import { HealthResponse, Todo, TodoNotFound, TodoRpcs, UpdateTodoInput } from '@template/shared';

const version = '0.1.0';

type TodoRow = {
  readonly id: string;
  readonly title: string;
  readonly completed: number;
  readonly created_at: string;
  readonly updated_at: string;
};

const decodeTodo = Schema.decodeUnknownSync(Todo);

const mapRowToTodo = (row: TodoRow) =>
  decodeTodo({
    id: row.id,
    title: row.title,
    completed: row.completed === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });

const ensureSchema = Effect.fn('ensureSchema')(function* () {
  const sql = yield* SqliteClient.SqliteClient;
  yield* sql`CREATE TABLE IF NOT EXISTS todos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`.pipe(Effect.orDie);
});

const listTodos = Effect.fn('listTodos')(function* () {
  const sql = yield* SqliteClient.SqliteClient;
  const rows =
    yield* sql<TodoRow>`SELECT id, title, completed, created_at, updated_at FROM todos ORDER BY created_at ASC`.pipe(
      Effect.orDie,
    );
  return rows.map(mapRowToTodo);
});

const createTodo = Effect.fn('createTodo')(function* (payload: { readonly title: string }) {
  const sql = yield* SqliteClient.SqliteClient;
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  yield* sql`INSERT INTO todos ${sql.insert({ id, title: payload.title, completed: 0, created_at: now, updated_at: now })}`.pipe(
    Effect.orDie,
  );
  return decodeTodo({ id, title: payload.title, completed: false, createdAt: now, updatedAt: now });
});

const findTodoById = Effect.fn('findTodoById')(function* (id: string) {
  const sql = yield* SqliteClient.SqliteClient;
  const rows =
    yield* sql<TodoRow>`SELECT id, title, completed, created_at, updated_at FROM todos WHERE id = ${id}`.pipe(
      Effect.orDie,
    );
  const row = rows[0];
  if (!row) {
    return yield* new TodoNotFound({ id });
  }
  return row;
});

const updateTodo = Effect.fn('updateTodo')(function* (payload: UpdateTodoInput) {
  const sql = yield* SqliteClient.SqliteClient;
  const existing = yield* findTodoById(payload.id);
  const updated = {
    title: payload.title ?? existing.title,
    completed: payload.completed ?? existing.completed === 1,
    updated_at: new Date().toISOString(),
  };
  yield* sql`UPDATE todos SET ${sql.update({
    title: updated.title,
    completed: updated.completed ? 1 : 0,
    updated_at: updated.updated_at,
  })} WHERE id = ${payload.id}`.pipe(Effect.orDie);
  return decodeTodo({
    id: payload.id,
    title: updated.title,
    completed: updated.completed,
    createdAt: existing.created_at,
    updatedAt: updated.updated_at,
  });
});

const deleteTodo = Effect.fn('deleteTodo')(function* (payload: { readonly id: string }) {
  const sql = yield* SqliteClient.SqliteClient;
  const existing = yield* findTodoById(payload.id);
  yield* sql`DELETE FROM todos WHERE id = ${payload.id}`.pipe(Effect.orDie);
  return mapRowToTodo(existing);
});

const TodoRpcHandlers = TodoRpcs.toLayer(
  Effect.gen(function* () {
    yield* ensureSchema();
    return TodoRpcs.of({
      health: () => Effect.succeed(new HealthResponse({ status: 'ok', service: 'api', version })),
      listTodos,
      createTodo,
      updateTodo,
      deleteTodo,
    });
  }),
);

const TodoRpcServer = RpcServer.layer(TodoRpcs).pipe(Layer.provide(TodoRpcHandlers));

const RpcProtocol = RpcServer.layerProtocolHttp({ path: '/rpc' }).pipe(
  Layer.provide(HttpRouter.layer),
);
const HealthRoute = HttpRouter.add(
  'GET',
  '/health',
  Effect.succeed(HttpServerResponse.jsonUnsafe({ status: 'ok', service: 'api', version })),
);
const HttpRoutes = Layer.mergeAll(RpcProtocol, HealthRoute);

const config = await Effect.runPromise(loadApiConfig());
const configuredDbPath = config.todoDbPath.trim();
if (configuredDbPath !== ':memory:' && configuredDbPath.includes('/')) {
  mkdirSync(configuredDbPath.slice(0, configuredDbPath.lastIndexOf('/')), { recursive: true });
}
const sqliteLayer = SqliteClient.layer({ filename: configuredDbPath });

const AppLayer = TodoRpcServer.pipe(
  Layer.provideMerge(HttpRoutes),
  Layer.provide(HttpRouter.serve(HttpRoutes)),
  Layer.provide(HttpRouter.layer),
  Layer.provide(NodeHttpServer.layer(createServer, { port: config.port, host: config.host })),
  Layer.provide(sqliteLayer),
  Layer.provide(Reactivity.layer),
  Layer.provide(RpcSerialization.layerNdjson),
);

Layer.launch(AppLayer).pipe(NodeRuntime.runMain);
