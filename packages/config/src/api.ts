import { Config, Effect } from "effect"

export type ApiProfile = "dev" | "test" | "prod"

export type ApiConfig = {
  readonly profile: ApiProfile
  readonly host: string
  readonly port: number
  readonly todoDbPath: string
}

const ApiProfileConfig = Config.literals(["dev", "test", "prod"], "APP_PROFILE").pipe(
  Config.withDefault("dev")
)

const baseHostConfig = Config.string("API_HOST")
const basePortConfig = Config.int("API_PORT")
const baseTodoDbPathConfig = Config.string("TODO_DB_PATH")

const hostByProfile = (profile: ApiProfile) => {
  switch (profile) {
    case "test":
      return baseHostConfig.pipe(Config.withDefault("127.0.0.1"))
    case "prod":
      return baseHostConfig
    case "dev":
    default:
      return baseHostConfig.pipe(Config.withDefault("0.0.0.0"))
  }
}

const portByProfile = (profile: ApiProfile) => {
  switch (profile) {
    case "prod":
      return basePortConfig
    case "test":
    case "dev":
    default:
      return basePortConfig.pipe(Config.withDefault(3737))
  }
}

const todoDbPathByProfile = (profile: ApiProfile) => {
  switch (profile) {
    case "prod":
      return baseTodoDbPathConfig
    case "test":
      return baseTodoDbPathConfig.pipe(Config.withDefault(".data/todos.test.sqlite"))
    case "dev":
    default:
      return baseTodoDbPathConfig.pipe(Config.withDefault(".data/todos.sqlite"))
  }
}

export const loadApiConfig = () =>
  Effect.gen(function*() {
    const profile = yield* ApiProfileConfig
    const host = yield* hostByProfile(profile)
    const port = yield* portByProfile(profile)
    const todoDbPath = yield* todoDbPathByProfile(profile)

    return {
      profile,
      host,
      port,
      todoDbPath
    } satisfies ApiConfig
  })
