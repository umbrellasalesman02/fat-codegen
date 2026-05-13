import { Effect } from 'effect';
import { createElement, type FormEvent, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ApiClient, Todo, makeApiClientLayer } from '@template/shared';

type SaveState = 'idle' | 'saving';
type AppError = string | null;

const rootElement = document.querySelector<HTMLDivElement>('#root');
if (!rootElement) {
  throw new Error('Missing #root element');
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api';

const runWithClient = <A, E>(effect: Effect.Effect<A, E, ApiClient>) =>
  Effect.runPromise(effect.pipe(Effect.provide(makeApiClientLayer(apiBaseUrl))));

const App = () => {
  const [health, setHealth] = useState('Checking API health...');
  const [todos, setTodos] = useState<ReadonlyArray<Todo>>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<AppError>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');

  const isBusy = saveState === 'saving';

  const loadTodos = useMemo(
    () => () =>
      runWithClient(
        Effect.gen(function* () {
          const client = yield* ApiClient;
          return yield* client.listTodos();
        }),
      ),
    [],
  );

  useEffect(() => {
    void runWithClient(
      Effect.gen(function* () {
        const client = yield* ApiClient;
        return yield* client.health();
      }),
    )
      .then((response) => {
        setHealth(`API healthy: ${response.service} ${response.version}`);
      })
      .catch((reason) => {
        setHealth(`API unreachable: ${reason instanceof Error ? reason.message : String(reason)}`);
      });

    void loadTodos()
      .then((items) => {
        setTodos(items);
      })
      .catch((reason) => {
        setError(reason instanceof Error ? reason.message : String(reason));
      });
  }, [loadTodos]);

  const submitTodo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (title.trim().length === 0 || isBusy) {
      return;
    }
    setSaveState('saving');
    setError(null);
    try {
      await runWithClient(
        Effect.gen(function* () {
          const client = yield* ApiClient;
          return yield* client.createTodo({ title: title.trim() });
        }),
      );
      setTitle('');
      setTodos(await loadTodos());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setSaveState('idle');
    }
  };

  const toggleTodo = async (todo: Todo) => {
    if (isBusy) return;
    setSaveState('saving');
    setError(null);
    try {
      await runWithClient(
        Effect.gen(function* () {
          const client = yield* ApiClient;
          return yield* client.updateTodo({ id: todo.id, completed: !todo.completed });
        }),
      );
      setTodos(await loadTodos());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setSaveState('idle');
    }
  };

  const removeTodo = async (todo: Todo) => {
    if (isBusy) return;
    setSaveState('saving');
    setError(null);
    try {
      await runWithClient(
        Effect.gen(function* () {
          const client = yield* ApiClient;
          return yield* client.deleteTodo({ id: todo.id });
        }),
      );
      setTodos(await loadTodos());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setSaveState('idle');
    }
  };

  return createElement(
    'main',
    { style: { maxWidth: '40rem', margin: '2rem auto', fontFamily: 'system-ui, sans-serif' } },
    createElement('h1', null, 'TypeScript Effect TODO Starter'),
    createElement('p', { id: 'health-status' }, health),
    createElement(
      'form',
      {
        onSubmit: (event) => void submitTodo(event as unknown as FormEvent<HTMLFormElement>),
        style: { display: 'flex', gap: '0.5rem' },
      },
      createElement('input', {
        value: title,
        onChange: (event: Event) => setTitle((event.target as HTMLInputElement).value),
        placeholder: 'Add a todo title',
        disabled: isBusy,
        'aria-label': 'New todo title',
      }),
      createElement(
        'button',
        { type: 'submit', disabled: isBusy || title.trim().length === 0 },
        'Add',
      ),
    ),
    error ? createElement('p', { role: 'alert' }, `Error: ${error}`) : null,
    createElement(
      'ul',
      { style: { marginTop: '1rem', padding: 0, listStyle: 'none' } },
      ...todos.map((todo) =>
        createElement(
          'li',
          {
            key: todo.id,
            style: { display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' },
          },
          createElement('input', {
            type: 'checkbox',
            checked: todo.completed,
            onChange: () => void toggleTodo(todo),
            'aria-label': `Toggle ${todo.title}`,
          }),
          createElement(
            'span',
            { style: { textDecoration: todo.completed ? 'line-through' : 'none', flex: '1' } },
            todo.title,
          ),
          createElement(
            'button',
            { type: 'button', onClick: () => void removeTodo(todo) },
            'Delete',
          ),
        ),
      ),
    ),
  );
};

createRoot(rootElement).render(createElement(App));
