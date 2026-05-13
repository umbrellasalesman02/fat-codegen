import { captureTitleSliceFixture, type CaptureFixtureCommand } from './fixture-capture.js';
import { fetchSourceRecordFromFileMaker } from './filemaker-source-fetch.js';

const usage =
  'Usage: node --import tsx src/features/titles/fixture-capture-cli.ts --table <tableName> --id <recordId> --out <outputFixturePath>';

const parseArgs = (args: ReadonlyArray<string>): CaptureFixtureCommand => {
  const get = (flag: string) => {
    const index = args.indexOf(flag);
    const value = index >= 0 ? args[index + 1] : undefined;
    return value?.trim();
  };

  const tableName = get('--table');
  const recordId = get('--id');
  const outputFixturePath = get('--out');

  if (!tableName || !recordId || !outputFixturePath) {
    throw new Error(usage);
  }

  return {
    tableName,
    recordId,
    outputFixturePath,
  };
};

const main = async () => {
  const command = parseArgs(process.argv.slice(2));
  const result = await captureTitleSliceFixture(command, {
    fetchSourceRecord: fetchSourceRecordFromFileMaker,
    projectRecord: (sourceRecord) => sourceRecord,
  });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
};

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
