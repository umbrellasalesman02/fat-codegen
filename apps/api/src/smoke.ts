import { Effect } from "effect"
import { ApiClient, makeApiClientLayer } from "@template/shared"

const port = Number(process.env.API_PORT ?? 3737)
const baseUrl = `http://127.0.0.1:${port}`

const program = Effect.gen(function*() {
  const client = yield* ApiClient
  return yield* client.health()
}).pipe(
  Effect.provide(makeApiClientLayer(baseUrl))
)

const health = await Effect.runPromise(program)

if (health.status !== "ok" || health.service !== "api" || health.version !== "0.1.0") {
  throw new Error(`Smoke check failed: unexpected payload ${JSON.stringify(health)}`)
}

console.log("[smoke] /health typed contract OK")
