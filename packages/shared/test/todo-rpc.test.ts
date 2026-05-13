import { assert, describe, it } from '@effect/vitest';
import { Schema } from 'effect';
import { HealthResponse, Todo } from '../src/todo-rpc.js';

describe('todo rpc schemas', () => {
  it('decodes todo payload', () => {
    const decode = Schema.decodeUnknownSync(Todo);
    const todo = decode({
      id: '1',
      title: 'Write docs',
      completed: false,
      createdAt: '2026-05-12T12:00:00.000Z',
      updatedAt: '2026-05-12T12:00:00.000Z',
    });
    assert.strictEqual(todo.title, 'Write docs');
  });

  it('decodes health payload', () => {
    const decode = Schema.decodeUnknownSync(HealthResponse);
    const health = decode({ status: 'ok', service: 'api', version: '0.1.0' });
    assert.strictEqual(health.service, 'api');
  });
});
