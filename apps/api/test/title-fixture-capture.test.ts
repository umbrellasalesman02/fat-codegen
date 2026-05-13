import { assert, describe, it } from '@effect/vitest';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { captureTitleSliceFixture } from '../src/features/titles/fixture-capture.js';

describe('title fixture capture command', () => {
  it('captures using generic command contract and stores source + projection record', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'title-fixture-'));
    const outputFixturePath = join(tempDir, 'fixture.json');

    const result = await captureTitleSliceFixture(
      {
        tableName: 'Title',
        recordId: '9B433A0E-7EBC-435C-8A99-D966BC17BA30',
        outputFixturePath,
      },
      {
        fetchSourceRecord: async () => ({ id: 'seed-id', name: 'Seed Title Fixture' }),
        projectRecord: (sourceRecord) => ({ titleId: String(sourceRecord.id) }),
      },
    );

    assert.strictEqual(result.fixture.tableName, 'Title');
    assert.strictEqual(result.fixture.recordId, '9B433A0E-7EBC-435C-8A99-D966BC17BA30');
    assert.deepStrictEqual(result.fixture.sourceRecord, { id: 'seed-id', name: 'Seed Title Fixture' });
    assert.deepStrictEqual(result.fixture.projectionRecord, { titleId: 'seed-id' });

    const written = await readFile(outputFixturePath, 'utf8');
    const parsed = JSON.parse(written) as { projectionRecord: unknown; sourceRecord: unknown };
    assert.deepStrictEqual(parsed.sourceRecord, { id: 'seed-id', name: 'Seed Title Fixture' });
    assert.deepStrictEqual(parsed.projectionRecord, { titleId: 'seed-id' });
  });

  it('surfaces diagnostics and reuses existing projection fixture when capture fails', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'title-fixture-'));
    const outputFixturePath = join(tempDir, 'fixture.json');

    const seedFixture = {
      capturedAt: '2026-01-01T00:00:00.000Z',
      tableName: 'Title',
      recordId: 'seed-id',
      sourceRecord: null,
      projectionRecord: { titleId: 'seed-id' },
      diagnostics: [],
    };
    await writeFile(outputFixturePath, `${JSON.stringify(seedFixture, null, 2)}\n`, 'utf8');

    const result = await captureTitleSliceFixture(
      {
        tableName: 'Title',
        recordId: 'seed-id',
        outputFixturePath,
      },
      {
        fetchSourceRecord: async () => {
          throw new Error('network down');
        },
        projectRecord: (sourceRecord) => sourceRecord,
      },
    );

    assert.strictEqual(result.diagnostics[0]?.code, 'CAPTURE_FAILED');
    assert.strictEqual(result.diagnostics[1]?.code, 'REUSED_EXISTING_PROJECTION');

    const written = await readFile(outputFixturePath, 'utf8');
    const parsed = JSON.parse(written) as { projectionRecord: unknown; diagnostics: Array<{ code: string }> };
    assert.deepStrictEqual(parsed.projectionRecord, { titleId: 'seed-id' });
    assert.strictEqual(parsed.diagnostics.some((d) => d.code === 'CAPTURE_FAILED'), true);
    assert.strictEqual(parsed.diagnostics.some((d) => d.code === 'REUSED_EXISTING_PROJECTION'), true);
  });
});
