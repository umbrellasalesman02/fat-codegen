import { assert, describe, it } from '@effect/vitest';
import { Effect } from 'effect';
import {
  MINIMAL_SCRIPT_SEMANTICS_SCOPE,
  TitleSliceGenerationFailure,
  generateTitleReadSummaryFromProjection,
} from '../src/features/titles/generation.js';

describe('title slice generation', () => {
  it.effect('supports only minimal required script semantics for slice-1', () =>
    Effect.gen(function* () {
      const summary = yield* generateTitleReadSummaryFromProjection({
        projectionRecord: {
          PrimaryKey: 'seed-id',
          'Header txt id': 'header-id',
          ModificationTimestamp: '2026-05-01T10:50:40Z',
        },
        requiredScriptSemantics: MINIMAL_SCRIPT_SEMANTICS_SCOPE,
      });

      assert.strictEqual(summary.titleId, 'seed-id');
    }),
  );

  it.effect('fails fast with machine-readable diagnostics for unsupported required semantics', () =>
    Effect.gen(function* () {
      const error: TitleSliceGenerationFailure = yield* Effect.flip(
        generateTitleReadSummaryFromProjection({
          projectionRecord: {
            PrimaryKey: 'seed-id',
            'Header txt id': 'header-id',
            ModificationTimestamp: '2026-05-01T10:50:40Z',
          },
          requiredScriptSemantics: ['FIELD_READ', 'RELATION_TRAVERSAL'],
        }),
      );

      assert.strictEqual(error.diagnostics[0]?.code, 'UNSUPPORTED_REQUIRED_SCRIPT_SEMANTIC');
      assert.strictEqual(error.diagnostics[0]?.sourceDomain, 'Behavior Logic');
      assert.strictEqual(error.diagnostics[0]?.details.requiredSemantic, 'RELATION_TRAVERSAL');
    }),
  );

  it.effect('classifies projection completeness failures into source-domain diagnostics', () =>
    Effect.gen(function* () {
      const error: TitleSliceGenerationFailure = yield* Effect.flip(
        generateTitleReadSummaryFromProjection({
          projectionRecord: {
            PrimaryKey: 'seed-id',
            ModificationTimestamp: '2026-05-01T10:50:40Z',
          },
        }),
      );

      assert.strictEqual(error.diagnostics[0]?.code, 'INVALID_SOURCE_PROJECTION_RECORD');
      assert.strictEqual(error.diagnostics[0]?.sourceDomain, 'Data Structure');
      assert.strictEqual(error.diagnostics[0]?.details.reason, 'InvalidRecordShape');
    }),
  );
});
