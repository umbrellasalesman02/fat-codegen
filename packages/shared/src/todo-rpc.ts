import { Schema } from 'effect';
import { Rpc, RpcGroup } from 'effect/unstable/rpc';

export class Todo extends Schema.Class<Todo>('Todo')({
  id: Schema.String,
  title: Schema.String,
  completed: Schema.Boolean,
  createdAt: Schema.DateFromString,
  updatedAt: Schema.DateFromString,
}) {}

export class TodoNotFound extends Schema.ErrorClass<TodoNotFound>('TodoNotFound')({
  _tag: Schema.tag('TodoNotFound'),
  id: Schema.String,
}) {}

export class CreateTodoInput extends Schema.Class<CreateTodoInput>('CreateTodoInput')({
  title: Schema.String,
}) {}

export class UpdateTodoInput extends Schema.Class<UpdateTodoInput>('UpdateTodoInput')({
  id: Schema.String,
  title: Schema.optional(Schema.String),
  completed: Schema.optional(Schema.Boolean),
}) {}

export class DeleteTodoInput extends Schema.Class<DeleteTodoInput>('DeleteTodoInput')({
  id: Schema.String,
}) {}

export class HealthResponse extends Schema.Class<HealthResponse>('HealthResponse')({
  status: Schema.Literal('ok'),
  service: Schema.Literal('api'),
  version: Schema.String,
}) {}

export const TodoRpcs = RpcGroup.make(
  Rpc.make('health', {
    success: HealthResponse,
  }),
  Rpc.make('listTodos', {
    success: Schema.Array(Todo),
  }),
  Rpc.make('createTodo', {
    payload: CreateTodoInput,
    success: Todo,
  }),
  Rpc.make('updateTodo', {
    payload: UpdateTodoInput,
    success: Todo,
    error: TodoNotFound,
  }),
  Rpc.make('deleteTodo', {
    payload: DeleteTodoInput,
    success: Todo,
    error: TodoNotFound,
  }),
);
