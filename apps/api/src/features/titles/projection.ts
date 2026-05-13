import { Effect, Schema } from 'effect';
import { TitleReadSummary } from '@template/shared';

const TITLE_SUMMARY_FIELD_POLICY = {
  titleId: 'PrimaryKey',
  titleNameLabel: 'Header txt id',
  modifiedAt: 'ModificationTimestamp',
} as const;

export const CANONICAL_MODIFIED_AT_SOURCE_FIELD = TITLE_SUMMARY_FIELD_POLICY.modifiedAt;

export class TitleProjectionError extends Schema.TaggedErrorClass<TitleProjectionError>()(
  'TitleProjectionError',
  {
    reason: Schema.Union([
      Schema.Literal('MissingRequiredField'),
      Schema.Literal('InvalidRecordShape'),
    ]),
    details: Schema.String,
  },
) {}

class SourceTitleSummaryRecord extends Schema.Class<SourceTitleSummaryRecord>('SourceTitleSummaryRecord')({
  PrimaryKey: Schema.String,
  'Header txt id': Schema.String,
  ModificationTimestamp: Schema.String,
}) {}

const decodeSourceTitleSummaryRecord = Schema.decodeUnknownSync(SourceTitleSummaryRecord);

const validateRequiredTextField = (value: string, fieldName: string) =>
  value.trim().length > 0
    ? Effect.succeed(value)
    : Effect.fail(
        new TitleProjectionError({
          reason: 'MissingRequiredField',
          details: `Missing required field "${fieldName}" for Title Read Summary`,
        }),
      );

export const mapSourceRecordToTitleReadSummary = (sourceRecord: unknown) =>
  Effect.gen(function* () {
    const parsed = yield* Effect.try({
      try: () => decodeSourceTitleSummaryRecord(sourceRecord),
      catch: (cause) =>
        new TitleProjectionError({
          reason: 'InvalidRecordShape',
          details: String(cause),
        }),
    });

    const titleId = yield* validateRequiredTextField(parsed.PrimaryKey, TITLE_SUMMARY_FIELD_POLICY.titleId);
    const titleNameLabel = yield* validateRequiredTextField(
      parsed['Header txt id'],
      TITLE_SUMMARY_FIELD_POLICY.titleNameLabel,
    );
    const modifiedAt = yield* validateRequiredTextField(
      parsed.ModificationTimestamp,
      TITLE_SUMMARY_FIELD_POLICY.modifiedAt,
    );

    return new TitleReadSummary({
      titleId,
      titleNameLabel,
      modifiedAt: new Date(modifiedAt),
    });
  });
