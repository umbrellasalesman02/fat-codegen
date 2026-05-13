import { TodosFeature } from './features/todos/TodosFeature.js';
import { TitleReadRoute } from './features/titles/components/TitleReadRoute.js';

export const App = () => (
  <main className="app-shell">
    {window.location.pathname.startsWith('/titles/') ? (
      <TitleReadRoute />
    ) : (
      <>
        <h1>TypeScript Effect TODO Starter</h1>
        <p>
          <a className="app-link" href="/titles/9B433A0E-7EBC-435C-8A99-D966BC17BA30">
            Open seed title route
          </a>
        </p>
        <TodosFeature />
      </>
    )}
  </main>
);
