/* eslint-disable no-undef */

/**
 * Runs all marketplace-cursor-sync test scenarios: backup .cursor,
 * run disabled (clean slate), enabled (create), disabled (remove), enabled (recreate),
 * then restore. Not part of vitest. Run: pnpm run marketplace-cursor:sync-test
 */

import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const CURSOR_DIR = path.join(ROOT, '.cursor');
const BACKUP_CURSOR = path.join(ROOT, '.cursor-testing-123');
const SINGLE_TEST = path.join(__dirname, 'marketplace-cursor-sync-test-a-single-condition.js');
const testStepsAll = [
  ['disabled', 'clean slate'],
  ['enabled', 'create symlinks and manifest'],
  ['disabled', 'remove only our symlinks and manifest'],
  ['enabled', 'recreate'],
  [
    'disabled-with-excluded-plugins',
    'disabled with CURSOR_EXCLUDED_PLUGINS set (exclusions ignored)',
  ],
  [
    'enabled-with-excluded-plugins',
    'enabled with CURSOR_EXCLUDED_PLUGINS (env-variables,turborepo excluded from rules)',
  ],
];

function renameIfExists(from, to) {
  if (fs.existsSync(from)) {
    if (fs.existsSync(to)) fs.rmSync(to, { recursive: true });
    fs.renameSync(from, to);
  }
}

function runSingleCondition(mode) {
  const result = spawnSync(process.execPath, [SINGLE_TEST, mode], {
    cwd: ROOT,
    stdio: 'pipe',
    encoding: 'utf8',
  });
  return result.status === 0;
}

function main() {
  const results = [];
  try {
    if (fs.existsSync(BACKUP_CURSOR)) fs.rmSync(BACKUP_CURSOR, { recursive: true });
    renameIfExists(CURSOR_DIR, BACKUP_CURSOR);
  } catch (e) {
    console.error('Backup failed:', e.message);
    if (fs.existsSync(BACKUP_CURSOR)) fs.renameSync(BACKUP_CURSOR, CURSOR_DIR);
    process.exit(1);
  }

  let allPassed = true;
  for (const [mode, label] of testStepsAll) {
    const passed = runSingleCondition(mode);
    results.push({ step: label, mode, passed });
    if (!passed) allPassed = false;
  }

  try {
    if (fs.existsSync(CURSOR_DIR)) fs.rmSync(CURSOR_DIR, { recursive: true });
    renameIfExists(BACKUP_CURSOR, CURSOR_DIR);
  } catch (e) {
    console.error('Restore failed:', e.message);
    process.exit(1);
  }

  for (const r of results) {
    console.log(r.passed ? 'PASS' : 'FAIL', r.step, `(${r.mode})`);
  }
  process.exit(allPassed ? 0 : 1);
}

main();
