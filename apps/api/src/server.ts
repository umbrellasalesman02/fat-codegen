import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { Effect, Layer, Ref } from "effect"
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
    const counter = yield* Ref.make(0)

    return handlers.handle("health", () =>
      Effect.succeed({
        status: "ok" as const,
        service: "api" as const,
        version: "0.1.0"
      })
    ).handle("counter", () =>
      Ref.get(counter).pipe(
        Effect.map((value) => ({ value }))
      )
    ).handle("incrementCounter", () =>
      Ref.updateAndGet(counter, (value) => value + 1).pipe(
        Effect.map((value) => ({ value }))
      )
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
