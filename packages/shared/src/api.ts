import { Schema } from 'effect';
import { HttpApi, HttpApiEndpoint, HttpApiGroup } from 'effect/unstable/httpapi';

export const HealthResponse = Schema.Struct({
  status: Schema.Literal('ok'),
  service: Schema.Literal('api'),
  version: Schema.String,
});

export const CounterResponse = Schema.Struct({
  value: Schema.Number,
});

export class SystemApi extends HttpApiGroup.make('system', { topLevel: true })
  .add(
    HttpApiEndpoint.get('health', '/health', {
      success: HealthResponse,
    }),
  )
  .add(
    HttpApiEndpoint.get('counter', '/counter', {
      success: CounterResponse,
    }),
  )
  .add(
    HttpApiEndpoint.post('incrementCounter', '/counter/increment', {
      success: CounterResponse,
    }),
  ) {}

export class Api extends HttpApi.make('template-api').add(SystemApi) {}
