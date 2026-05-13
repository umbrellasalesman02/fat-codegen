import { mkdirSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from '@playwright/test';

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
const runDir = join(tmpdir(), `template-e2e-${runId}`);
const dbPath = join(runDir, 'todos.sqlite');

mkdirSync(runDir, { recursive: true });

process.env.PLAYWRIGHT_E2E_TMP_DIR = runDir;
process.env.TODO_DB_PATH = dbPath;
process.env.APP_PROFILE = 'test';
process.env.API_HOST = process.env.API_HOST ?? '127.0.0.1';
process.env.API_PORT = process.env.API_PORT ?? '3747';

const WEB_HOST = '127.0.0.1';
const WEB_PORT = Number(process.env.WEB_PORT ?? '4273');

async function assertBrowserInstalled() {
  if (process.env.PLAYWRIGHT_SKIP_BROWSER_CHECK === 'true') {
    return;
  }

  try {
    const executable = chromium.executablePath();
    if (!executable || executable.length === 0) {
      throw new Error('Chromium executable path is empty');
    }
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Playwright Chromium is not available. Run "pnpm exec playwright install chromium".\nDetails: ${details}`,
    );
  }
}

function assertPortIsFree(host: string, port: number) {
  return new Promise<void>((resolve, reject) => {
    const server = createServer();

    server.once('error', (error: NodeJS.ErrnoException) => {
      server.close();
      if (error.code === 'EADDRINUSE') {
        const message = `Port ${host}:${port} is already in use. Stop the conflicting process or set PLAYWRIGHT_REUSE_SERVER=true.`;
        console.error(message);
        reject(
          new Error(
            message
          ),
        );
        return;
      }

      reject(
        new Error(
          `Failed preflight port check for ${host}:${port}: ${error.code ?? 'UNKNOWN'} ${error.message}`,
        ),
      );
    });

    server.once('listening', () => {
      server.close(() => resolve());
    });

    server.listen(port, host);
  });
}

export default async function globalSetup() {
  await assertBrowserInstalled();

  const enablePortPreflight = process.env.PLAYWRIGHT_PORT_PREFLIGHT === 'true';
  if (enablePortPreflight && process.env.PLAYWRIGHT_REUSE_SERVER !== 'true') {
    await assertPortIsFree(process.env.API_HOST ?? '127.0.0.1', Number(process.env.API_PORT ?? '3747'));
    await assertPortIsFree(WEB_HOST, WEB_PORT);
  }
}
