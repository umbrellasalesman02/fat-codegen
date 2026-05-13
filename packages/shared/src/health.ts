import { Effect } from 'effect';

export type Health = {
  readonly status: 'ok';
  readonly service: 'api';
  readonly version: string;
};

export const makeHealth = (version: string): Health => ({
  status: 'ok',
  service: 'api',
  version,
});

export const makeHealthEffect = (version: string) => Effect.succeed(makeHealth(version));
