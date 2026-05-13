import { assert, describe, it } from "@effect/vitest"
import { ConfigProvider, Effect } from "effect"
import { loadApiConfig } from "../src/api.js"

describe("api config", () => {
  it("uses dev defaults", () => {
    const config = Effect.runSync(
      loadApiConfig().pipe(Effect.provide(ConfigProvider.layer(ConfigProvider.fromEnv({ env: {} }))))
    )
    assert.strictEqual(config.profile, "dev")
    assert.strictEqual(config.host, "0.0.0.0")
    assert.strictEqual(config.port, 3737)
    assert.strictEqual(config.todoDbPath, ".data/todos.sqlite")
  })

  it("uses test defaults", () => {
    const config = Effect.runSync(
      loadApiConfig().pipe(Effect.provide(ConfigProvider.layer(ConfigProvider.fromEnv({ env: { APP_PROFILE: "test" } }))))
    )
    assert.strictEqual(config.profile, "test")
    assert.strictEqual(config.host, "127.0.0.1")
    assert.strictEqual(config.port, 3737)
    assert.strictEqual(config.todoDbPath, ".data/todos.test.sqlite")
  })

  it("supports explicit overrides", () => {
    const config = Effect.runSync(
      loadApiConfig().pipe(Effect.provide(ConfigProvider.layer(ConfigProvider.fromEnv({
        env: {
          APP_PROFILE: "test",
          API_HOST: "127.0.0.1",
          API_PORT: "4747",
          TODO_DB_PATH: "/tmp/e2e.sqlite"
        }
      }))))
    )
    assert.strictEqual(config.profile, "test")
    assert.strictEqual(config.host, "127.0.0.1")
    assert.strictEqual(config.port, 4747)
    assert.strictEqual(config.todoDbPath, "/tmp/e2e.sqlite")
  })
})
