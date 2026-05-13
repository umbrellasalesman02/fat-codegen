import { mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
const runDir = join(tmpdir(), `template-e2e-${runId}`);
const dbPath = join(runDir, 'todos.sqlite');

mkdirSync(runDir, { recursive: true });

process.env.PLAYWRIGHT_E2E_TMP_DIR = runDir;
process.env.TODO_DB_PATH = dbPath;
process.env.APP_PROFILE = 'test';
process.env.API_HOST = process.env.API_HOST ?? '127.0.0.1';
process.env.API_PORT = process.env.API_PORT ?? '3737';

export default async function globalSetup() {
  return;
}
