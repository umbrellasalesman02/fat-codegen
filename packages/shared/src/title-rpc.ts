import { Schema } from 'effect';
import { Rpc, RpcGroup } from 'effect/unstable/rpc';

export class TitleReadSummary extends Schema.Class<TitleReadSummary>('TitleReadSummary')({
  titleId: Schema.String,
  titleNameLabel: Schema.String,
  modifiedAt: Schema.DateFromString,
}) {}

export class TitleNotInSliceScope extends Schema.ErrorClass<TitleNotInSliceScope>(
  'TitleNotInSliceScope',
)({
  _tag: Schema.tag('TitleNotInSliceScope'),
  titleId: Schema.String,
  seedTitleId: Schema.String,
}) {}

export class GetTitleReadSummaryInput extends Schema.Class<GetTitleReadSummaryInput>(
  'GetTitleReadSummaryInput',
)({
  titleId: Schema.String,
}) {}

export const TitleRpcs = RpcGroup.make(
  Rpc.make('getTitleReadSummary', {
    payload: GetTitleReadSummaryInput,
    success: TitleReadSummary,
    error: TitleNotInSliceScope,
  }),
);
