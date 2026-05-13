import { Effect } from 'effect';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Schema } from 'effect';
import { TitleNotInSliceScope } from '@template/shared';
import { generateTitleReadSummaryFromProjection } from './generation.js';

export const SEED_TITLE_ID = '9B433A0E-7EBC-435C-8A99-D966BC17BA30';

const SEED_FIXTURE_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../../../../source/fixtures/title-slice/seed-title-fixture.json',
);

type SeedFixtureRecord = {
  readonly projectionRecord: unknown;
};

class SeedFixtureLoadError extends Schema.TaggedErrorClass<SeedFixtureLoadError>()(
  'SeedFixtureLoadError',
  { details: Schema.String },
) {}

const decodeSeedFixtureRecord = Schema.decodeUnknownSync(
  Schema.fromJsonString(
    Schema.Struct({
      projectionRecord: Schema.Unknown,
    }),
  ),
);

const loadSeedProjectionRecord = Effect.tryPromise({
  try: async () => {
    const raw = await readFile(SEED_FIXTURE_PATH, 'utf8');
    const fixture = decodeSeedFixtureRecord(raw) as SeedFixtureRecord;
    return fixture.projectionRecord;
  },
  catch: (cause) =>
    new SeedFixtureLoadError({
      details: `Failed to load seed title fixture from ${SEED_FIXTURE_PATH}: ${String(cause)}`,
    }),
});

const readSeedSummary = loadSeedProjectionRecord.pipe(
  Effect.flatMap((projectionRecord) =>
    generateTitleReadSummaryFromProjection({
      projectionRecord,
    }),
  ),
  Effect.orDie,
);

export const readTitleInSliceScope = (titleId: string) =>
  Effect.gen(function* () {
    if (titleId !== SEED_TITLE_ID) {
      return yield* new TitleNotInSliceScope({
        titleId,
        seedTitleId: SEED_TITLE_ID,
      });
    }

    return yield* readSeedSummary;
  });
