import { Effect } from 'effect';
import { loadApiConfig } from '../../../packages/config/src/index.js';
import { ApiClient, makeApiClientLayer } from '@template/shared';

const config = await Effect.runPromise(loadApiConfig());
const baseHost = config.host === '0.0.0.0' ? '127.0.0.1' : config.host;
const baseUrl = `http://${baseHost}:${config.port}`;

const program = Effect.gen(function* () {
  const client = yield* ApiClient;
  return yield* client.health();
}).pipe(Effect.provide(makeApiClientLayer(baseUrl)));

const health = await Effect.runPromise(program);

if (health.status !== 'ok' || health.service !== 'api' || health.version !== '0.1.0') {
  throw new Error(`Smoke check failed: unexpected payload ${JSON.stringify(health)}`);
}

console.log('[smoke] RPC health contract OK');
