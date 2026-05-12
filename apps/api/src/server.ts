import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { Effect, Layer } from "effect"
import { HttpRouter } from "effect/unstable/http"
import { HttpApiBuilder } from "effect/unstable/httpapi"
import { createServer } from "node:http"
import { Api } from "@template/shared"

const port = Number(process.env.API_PORT ?? 3737)

const SystemApiHandlers = HttpApiBuilder.group(
  Api,
  "system",
  // oxlint-disable-next-line eslint/require-yield
  Effect.fn(function*(handlers) {
    return handlers.handle("health", () =>
      Effect.succeed({
        status: "ok" as const,
        service: "api" as const,
        version: "0.1.0"
      })
    )
  })
)

const ApiRoutes = HttpApiBuilder.layer(Api).pipe(
  Layer.provide(SystemApiHandlers)
)

const HttpServerLayer = HttpRouter.serve(ApiRoutes).pipe(
  Layer.provide(NodeHttpServer.layer(createServer, { port }))
)

Layer.launch(HttpServerLayer).pipe(NodeRuntime.runMain)
