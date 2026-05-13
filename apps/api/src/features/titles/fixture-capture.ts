import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export type CaptureFixtureCommand = {
  readonly tableName: string;
  readonly recordId: string;
  readonly outputFixturePath: string;
};

export type FixtureCaptureDiagnostic = {
  readonly level: 'info' | 'error';
  readonly code: 'CAPTURE_SUCCEEDED' | 'CAPTURE_FAILED' | 'REUSED_EXISTING_PROJECTION';
  readonly message: string;
};

export type TitleSliceFixtureRecord = {
  readonly capturedAt: string;
  readonly tableName: string;
  readonly recordId: string;
  readonly sourceRecord: Record<string, unknown> | null;
  readonly projectionRecord: Record<string, unknown> | null;
  readonly diagnostics: ReadonlyArray<FixtureCaptureDiagnostic>;
};

export type FixtureCaptureResult = {
  readonly fixture: TitleSliceFixtureRecord;
  readonly diagnostics: ReadonlyArray<FixtureCaptureDiagnostic>;
};

export type FixtureCaptureDependencies = {
  fetchSourceRecord(command: CaptureFixtureCommand): Promise<Record<string, unknown>>;
  projectRecord(sourceRecord: Record<string, unknown>): Record<string, unknown>;
};

const parseFixtureFile = (raw: string): TitleSliceFixtureRecord | null => {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === 'object' && 'projectionRecord' in parsed) {
      return parsed as TitleSliceFixtureRecord;
    }
    return null;
  } catch {
    return null;
  }
};

const readExistingFixture = async (outputFixturePath: string): Promise<TitleSliceFixtureRecord | null> => {
  try {
    const raw = await readFile(outputFixturePath, 'utf8');
    return parseFixtureFile(raw);
  } catch {
    return null;
  }
};

const persistFixture = async (fixture: TitleSliceFixtureRecord, outputFixturePath: string): Promise<void> => {
  await mkdir(dirname(outputFixturePath), { recursive: true });
  await writeFile(outputFixturePath, `${JSON.stringify(fixture, null, 2)}\n`, 'utf8');
};

export const captureTitleSliceFixture = async (
  command: CaptureFixtureCommand,
  dependencies: FixtureCaptureDependencies,
): Promise<FixtureCaptureResult> => {
  const existing = await readExistingFixture(command.outputFixturePath);

  try {
    const sourceRecord = await dependencies.fetchSourceRecord(command);
    const projectionRecord = dependencies.projectRecord(sourceRecord);
    const diagnostics: ReadonlyArray<FixtureCaptureDiagnostic> = [
      {
        level: 'info',
        code: 'CAPTURE_SUCCEEDED',
        message: `Captured ${command.tableName}/${command.recordId} into fixture`,
      },
    ];
    const fixture: TitleSliceFixtureRecord = {
      capturedAt: new Date().toISOString(),
      tableName: command.tableName,
      recordId: command.recordId,
      sourceRecord,
      projectionRecord,
      diagnostics,
    };
    await persistFixture(fixture, command.outputFixturePath);
    return {
      fixture,
      diagnostics,
    };
  } catch (error) {
    const captureFailure: FixtureCaptureDiagnostic = {
      level: 'error',
      code: 'CAPTURE_FAILED',
      message: `Capture failed for ${command.tableName}/${command.recordId}: ${error instanceof Error ? error.message : String(error)}`,
    };

    if (existing?.projectionRecord) {
      const reuseDiagnostic: FixtureCaptureDiagnostic = {
        level: 'info',
        code: 'REUSED_EXISTING_PROJECTION',
        message: 'Capture failed but existing projectionRecord is present; runtime path remains unblocked.',
      };
      const fixture: TitleSliceFixtureRecord = {
        ...existing,
        diagnostics: [...existing.diagnostics, captureFailure, reuseDiagnostic],
      };
      await persistFixture(fixture, command.outputFixturePath);
      return {
        fixture,
        diagnostics: [captureFailure, reuseDiagnostic],
      };
    }

    throw new Error(
      `Capture failed and no existing projected fixture is available for ${command.tableName}/${command.recordId}`,
    );
  }
};
