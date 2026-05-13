import { Effect } from 'effect';
import { mapSourceRecordToTitleReadSummary } from './projection.js';

export const SOURCE_DOMAINS = ['Data Structure', 'Reference Data', 'Behavior Logic'] as const;
export type SourceDomain = (typeof SOURCE_DOMAINS)[number];

export type TitleSliceDiagnostic = {
  readonly code: string;
  readonly message: string;
  readonly sourceDomain: SourceDomain;
  readonly details: Readonly<Record<string, string>>;
};

export class TitleSliceGenerationFailure extends Error {
  readonly _tag = 'TitleSliceGenerationFailure';

  constructor(readonly diagnostics: ReadonlyArray<TitleSliceDiagnostic>) {
    super(diagnostics.map((diagnostic) => `[${diagnostic.code}] ${diagnostic.message}`).join('\n'));
    this.name = 'TitleSliceGenerationFailure';
  }
}

export const MINIMAL_SCRIPT_SEMANTICS_SCOPE = ['FIELD_READ'] as const;

const SUPPORTED_REQUIRED_SCRIPT_SEMANTICS = new Set<string>(MINIMAL_SCRIPT_SEMANTICS_SCOPE);

const diagnosticsFailure = (...diagnostics: ReadonlyArray<TitleSliceDiagnostic>) =>
  new TitleSliceGenerationFailure(diagnostics);

const enforceRequiredScriptSemantics = (requiredSemantics: ReadonlyArray<string>) =>
  Effect.gen(function* () {
    for (const semantic of requiredSemantics) {
      if (SUPPORTED_REQUIRED_SCRIPT_SEMANTICS.has(semantic)) {
        continue;
      }
      return yield* Effect.fail(
        diagnosticsFailure({
          code: 'UNSUPPORTED_REQUIRED_SCRIPT_SEMANTIC',
          message: `Unsupported required script semantic "${semantic}" encountered`,
          sourceDomain: 'Behavior Logic',
          details: {
            requiredSemantic: semantic,
            policy: 'fail-fast',
          },
        }),
      );
    }
  });

export type GenerateTitleReadSummaryInput = {
  readonly projectionRecord: unknown;
  readonly requiredScriptSemantics?: ReadonlyArray<string>;
};

export const generateTitleReadSummaryFromProjection = ({
  projectionRecord,
  requiredScriptSemantics = MINIMAL_SCRIPT_SEMANTICS_SCOPE,
}: GenerateTitleReadSummaryInput) =>
  Effect.gen(function* () {
    yield* enforceRequiredScriptSemantics(requiredScriptSemantics);
    return yield* mapSourceRecordToTitleReadSummary(projectionRecord).pipe(
      Effect.mapError((error) =>
        diagnosticsFailure({
          code:
            error.reason === 'MissingRequiredField'
              ? 'SLICE_FIELD_COMPLETENESS_VIOLATION'
              : 'INVALID_SOURCE_PROJECTION_RECORD',
          message: error.details,
          sourceDomain: 'Data Structure',
          details: {
            reason: error.reason,
          },
        }),
      ),
    );
  });
