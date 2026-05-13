import type { CaptureFixtureCommand } from './fixture-capture.js';

type FileMakerEnvConfig = {
  readonly serverUrl: string;
  readonly databaseName: string;
  readonly username: string;
  readonly password: string;
};

const readRequiredEnv = (name: string): string => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. Load env before capture (for example via node --env-file=.env ...).`,
    );
  }
  return value;
};

const readFileMakerConfig = (): FileMakerEnvConfig => ({
  serverUrl: readRequiredEnv('FM_API_SERVER'),
  databaseName: readRequiredEnv('FM_API_DB_NAME'),
  username: readRequiredEnv('FM_ODATA_USER'),
  password: readRequiredEnv('FM_ODATA_PASSWORD'),
});

const quoteODataString = (value: string): string => `'${value.replace(/'/g, "''")}'`;
const describeUnknownError = (value: unknown): string => {
  if (value instanceof Error) {
    return value.message;
  }
  try {
    return JSON.stringify(value);
  } catch {
    return 'unknown error';
  }
};

export const fetchSourceRecordFromFileMaker = async (
  command: CaptureFixtureCommand,
): Promise<Record<string, unknown>> => {
  const config = readFileMakerConfig();
  const { FMServerConnection, fmTableOccurrence, textField } = await import('@proofkit/fmodata');
  const connection = new FMServerConnection({
    serverUrl: config.serverUrl,
    auth: {
      username: config.username,
      password: config.password,
    },
  });
  const db = connection.database(config.databaseName);
  const table =
    command.tableName === 'FAT Title'
      ? fmTableOccurrence(
          command.tableName,
          {
            PrimaryKey: textField(),
          },
          // Intentionally capture broad raw source shape for traceability in fixture sourceRecord.
          { defaultSelect: 'all' },
        )
      : fmTableOccurrence(
          command.tableName,
          {
            PrimaryKey: textField(),
          },
          { defaultSelect: 'schema' },
        );

  const result = (await (db as any)
    .from(table)
    .list()
    .where(`PrimaryKey eq ${quoteODataString(command.recordId)}`)
    .top(1)
    .maybeSingle()
    .execute()) as {
    readonly data?: Record<string, unknown> | null;
    readonly error?: unknown;
  };

  if (result.error) {
    throw new Error(
      `FileMaker query failed for table ${command.tableName} and id ${command.recordId}: ${describeUnknownError(result.error)}`,
    );
  }
  if (!result.data) {
    throw new Error(
      `No FileMaker record found for table ${command.tableName} and id ${command.recordId}`,
    );
  }

  return result.data;
};
