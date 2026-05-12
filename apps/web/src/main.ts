import { Effect } from "effect"
import { ApiClient, makeApiClientLayer } from "@template/shared"

const healthElement = document.querySelector<HTMLParagraphElement>("#health-status")
const counterElement = document.querySelector<HTMLParagraphElement>("#counter-value")
const incrementButton = document.querySelector<HTMLButtonElement>("#counter-increment")

if (!healthElement) {
  throw new Error("Missing #health-status element")
}
if (!counterElement) {
  throw new Error("Missing #counter-value element")
}
if (!incrementButton) {
  throw new Error("Missing #counter-increment element")
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api"

const renderHealth = (message: string) => {
  healthElement.textContent = message
}

const renderCounter = (value: number | string) => {
  counterElement.textContent = `Counter: ${value}`
}

const healthProgram = Effect.gen(function*() {
  const client = yield* ApiClient
  return yield* client.health()
}).pipe(
  Effect.provide(makeApiClientLayer(apiBaseUrl))
)

const counterProgram = Effect.gen(function*() {
  const client = yield* ApiClient
  return yield* client.counter()
}).pipe(
  Effect.provide(makeApiClientLayer(apiBaseUrl))
)

const incrementProgram = Effect.gen(function*() {
  const client = yield* ApiClient
  return yield* client.incrementCounter()
}).pipe(
  Effect.provide(makeApiClientLayer(apiBaseUrl))
)

const run = async () => {
  try {
    const [health, counter] = await Promise.all([
      Effect.runPromise(healthProgram),
      Effect.runPromise(counterProgram)
    ])
    renderHealth(`API healthy: ${health.service} ${health.version}`)
    renderCounter(counter.value)
  } catch (error) {
    renderHealth(`API unreachable: ${error instanceof Error ? error.message : String(error)}`)
    renderCounter("unavailable")
  }
}

incrementButton.addEventListener("click", async () => {
  incrementButton.disabled = true
  try {
    const counter = await Effect.runPromise(incrementProgram)
    renderCounter(counter.value)
  } catch (error) {
    renderCounter(`error (${error instanceof Error ? error.message : String(error)})`)
  } finally {
    incrementButton.disabled = false
  }
})

void run()
