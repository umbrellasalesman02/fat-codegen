import { rmSync } from "node:fs"

export default async function globalTeardown() {
  const runDir = process.env.PLAYWRIGHT_E2E_TMP_DIR
  if (runDir && runDir.length > 0) {
    rmSync(runDir, { recursive: true, force: true })
  }
}
