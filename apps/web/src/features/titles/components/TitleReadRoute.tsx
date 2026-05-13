import { useEffect, useMemo, useState } from 'react';
import { titleClient } from './title-client.js';

type RouteState =
  | { readonly _tag: 'loading' }
  | {
      readonly _tag: 'loaded';
      readonly summary: {
        readonly titleId: string;
        readonly titleNameLabel: string;
        readonly modifiedAt: string;
      };
    }
  | { readonly _tag: 'scope'; readonly message: string }
  | { readonly _tag: 'error'; readonly message: string };

const parseTitleIdFromPath = (pathname: string): string | null => {
  const match = pathname.match(/^\/titles\/([^/]+)$/);
  return match ? decodeURIComponent(match[1] ?? '') : null;
};

const errorMessageFromUnknown = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const isTitleNotInSliceScope = (
  error: unknown,
): error is { readonly _tag: 'TitleNotInSliceScope' } =>
  typeof error === 'object' &&
  error !== null &&
  '_tag' in error &&
  (error as { _tag?: string })._tag === 'TitleNotInSliceScope';

export const TitleReadRoute = () => {
  const titleId = useMemo(() => parseTitleIdFromPath(window.location.pathname), []);
  const [state, setState] = useState<RouteState>({ _tag: 'loading' });

  useEffect(() => {
    if (!titleId) {
      setState({ _tag: 'error', message: 'Invalid title route. Expected /titles/:titleId.' });
      return;
    }

    let active = true;
    void titleClient
      .getReadSummary(titleId)
      .then((summary) => {
        if (!active) {
          return;
        }
        setState({
          _tag: 'loaded',
          summary: {
            titleId: summary.titleId,
            titleNameLabel: summary.titleNameLabel,
            modifiedAt: summary.modifiedAt.toISOString(),
          },
        });
      })
      .catch((error) => {
        if (!active) {
          return;
        }
        if (isTitleNotInSliceScope(error)) {
          setState({
            _tag: 'scope',
            message: `Title ${titleId} is outside the current slice scope. Only the seed title is available in slice-1.`,
          });
          return;
        }
        const message = errorMessageFromUnknown(error);
        setState({ _tag: 'error', message: message });
      });

    return () => {
      active = false;
    };
  }, [titleId]);

  if (state._tag === 'loading') {
    return <p>Loading title summary...</p>;
  }

  if (state._tag === 'scope') {
    return (
      <section>
        <h1>Title Slice Scope</h1>
        <p id="title-scope-message">{state.message}</p>
      </section>
    );
  }

  if (state._tag === 'error') {
    return (
      <section>
        <h1>Title Route Error</h1>
        <p>{state.message}</p>
      </section>
    );
  }

  return (
    <section>
      <h1>Title Read Summary</h1>
      <dl className="title-summary">
        <dt>Title ID</dt>
        <dd>{state.summary.titleId}</dd>
        <dt>Title Name Label</dt>
        <dd>{state.summary.titleNameLabel}</dd>
        <dt>Modified At</dt>
        <dd>{state.summary.modifiedAt}</dd>
      </dl>
    </section>
  );
};
