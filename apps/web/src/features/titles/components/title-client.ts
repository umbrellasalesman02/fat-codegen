import { Context, Effect, Layer } from 'effect';
import { FetchHttpClient, HttpClient, HttpClientRequest } from 'effect/unstable/http';
import { RpcClient, RpcGroup, RpcSerialization } from 'effect/unstable/rpc';
import type { RpcClientError } from 'effect/unstable/rpc/RpcClientError';
import { TitleRpcs } from '@template/shared';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api';

class TitleApiClient extends Context.Service<
  TitleApiClient,
  RpcClient.RpcClient<RpcGroup.Rpcs<typeof TitleRpcs>, RpcClientError>
>()('web/TitleApiClient') {}

const makeTitleApiClientLayer = () =>
  Layer.effect(TitleApiClient)(RpcClient.make(TitleRpcs).pipe(Effect.orDie)).pipe(
    Layer.provide(
      RpcClient.layerProtocolHttp({
        url: `${apiBaseUrl}/rpc`,
        transformClient: HttpClient.mapRequest(HttpClientRequest.acceptJson),
      }),
    ),
    Layer.provide(RpcSerialization.layerNdjson),
    Layer.provide(FetchHttpClient.layer),
  );

const runWithClient = <A, E>(effect: Effect.Effect<A, E, TitleApiClient>) =>
  Effect.runPromise(effect.pipe(Effect.provide(makeTitleApiClientLayer())));

export const titleClient = {
  getReadSummary: (titleId: string) =>
    runWithClient(
      Effect.gen(function* () {
        const client = yield* TitleApiClient;
        return yield* client.getTitleReadSummary({ titleId });
      }),
    ),
};
