import { Context, Effect, Layer } from 'effect';
import { FetchHttpClient, HttpClient, HttpClientRequest } from 'effect/unstable/http';
import { RpcClient, RpcGroup, RpcSerialization } from 'effect/unstable/rpc';
import type { RpcClientError } from 'effect/unstable/rpc/RpcClientError';
import { TodoRpcs } from './todo-rpc.js';

export class ApiClient extends Context.Service<
  ApiClient,
  RpcClient.RpcClient<RpcGroup.Rpcs<typeof TodoRpcs>, RpcClientError>
>()('template/ApiClient') {}

export const makeApiClientLayer = (baseUrl: string) =>
  Layer.effect(ApiClient)(RpcClient.make(TodoRpcs).pipe(Effect.orDie)).pipe(
    Layer.provide(
      RpcClient.layerProtocolHttp({
        url: `${baseUrl}/rpc`,
        transformClient: HttpClient.mapRequest(HttpClientRequest.acceptJson),
      }),
    ),
    Layer.provide(RpcSerialization.layerNdjson),
    Layer.provide(FetchHttpClient.layer),
  );
