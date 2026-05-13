import { Effect } from 'effect';
import { TitleNotInSliceScope, TitleReadSummary } from '@template/shared';

export const SEED_TITLE_ID = '9B433A0E-7EBC-435C-8A99-D966BC17BA30';

const SKELETON_TITLE_SUMMARY = new TitleReadSummary({
  titleId: SEED_TITLE_ID,
  titleNameLabel: 'Seed Title Fixture',
  modifiedAt: new Date('2026-01-01T00:00:00.000Z'),
});

export const readTitleInSliceScope = (titleId: string) =>
  Effect.gen(function* () {
    if (titleId !== SEED_TITLE_ID) {
      return yield* new TitleNotInSliceScope({
        titleId,
        seedTitleId: SEED_TITLE_ID,
      });
    }

    return SKELETON_TITLE_SUMMARY;
  });
