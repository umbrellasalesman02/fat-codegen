import { SqliteClient } from '@effect/sql-sqlite-node';
import { Context, Effect, Layer } from 'effect';
import { Todo, TodoNotFound, UpdateTodoInput } from '@template/shared';
import { mapRowToTodo } from './model.js';
import type { TodoRow } from './model.js';

export class TodoRepository extends Context.Service<
  TodoRepository,
  {
    readonly list: Effect.Effect<ReadonlyArray<Todo>>;
    create(input: { readonly title: string }): Effect.Effect<Todo>;
    findById(id: string): Effect.Effect<TodoRow, TodoNotFound>;
    update(input: UpdateTodoInput): Effect.Effect<Todo, TodoNotFound>;
    remove(input: { readonly id: string }): Effect.Effect<Todo, TodoNotFound>;
  }
>()('template/api/features/todos/TodoRepository') {
  static readonly layer = Layer.effect(
    TodoRepository,
    Effect.gen(function* () {
      const sql = yield* SqliteClient.SqliteClient;

      yield* sql`CREATE TABLE IF NOT EXISTS todos (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`.pipe(Effect.orDie);

      const list =
        sql<TodoRow>`SELECT id, title, completed, created_at, updated_at FROM todos ORDER BY created_at ASC`.pipe(
          Effect.orDie,
          Effect.map((rows) => rows.map(mapRowToTodo)),
        );

      const create = Effect.fn('TodoRepository.create')(function* (input: {
        readonly title: string;
      }) {
        const now = new Date();
        const nowIso = now.toISOString();
        const id = crypto.randomUUID();
        yield* sql`INSERT INTO todos ${sql.insert({
          id,
          title: input.title,
          completed: 0,
          created_at: nowIso,
          updated_at: nowIso,
        })}`.pipe(Effect.orDie);
        return new Todo({
          id,
          title: input.title,
          completed: false,
          createdAt: now,
          updatedAt: now,
        });
      });

      const findById = Effect.fn('TodoRepository.findById')(function* (id: string) {
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

      const update = Effect.fn('TodoRepository.update')(function* (input: UpdateTodoInput) {
        const existing = yield* findById(input.id);
        const updatedTitle = input.title ?? existing.title;
        const updatedCompleted = input.completed ?? existing.completed === 1;
        const updatedAt = new Date();
        const updatedAtIso = updatedAt.toISOString();
        yield* sql`UPDATE todos SET ${sql.update({
          title: updatedTitle,
          completed: updatedCompleted ? 1 : 0,
          updated_at: updatedAtIso,
        })} WHERE id = ${input.id}`.pipe(Effect.orDie);
        return new Todo({
          id: input.id,
          title: updatedTitle,
          completed: updatedCompleted,
          createdAt: new Date(existing.created_at),
          updatedAt,
        });
      });

      const remove = Effect.fn('TodoRepository.remove')(function* (input: { readonly id: string }) {
        const existing = yield* findById(input.id);
        yield* sql`DELETE FROM todos WHERE id = ${input.id}`.pipe(Effect.orDie);
        return mapRowToTodo(existing);
      });

      return TodoRepository.of({
        list,
        create,
        findById,
        update,
        remove,
      });
    }),
  );
}
