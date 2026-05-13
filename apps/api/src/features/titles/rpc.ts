import { Effect } from 'effect';
import { TitleRpcs } from '@template/shared';
import { readTitleInSliceScope } from './slice.js';

export const makeTitleRpcHandlers = () =>
  TitleRpcs.toLayer(
    Effect.succeed(
      TitleRpcs.of({
        getTitleReadSummary: (input) => readTitleInSliceScope(input.titleId),
      }),
    ),
  );
