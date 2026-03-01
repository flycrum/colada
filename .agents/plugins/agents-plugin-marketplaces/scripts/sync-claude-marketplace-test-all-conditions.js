/**
 * Runs all sync-claude-marketplace test scenarios: backup .claude and .claude-plugin,
 * run disabled (clean slate), enabled (create), disabled (surgical remove), enabled (surgical edit),
 * then restore. Not part of vitest. Run: pnpm run marketplace-claude:test-sync
 */

import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** Repo root */
const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const CLAUDE_DIR = path.join(ROOT, '.claude');
const PLUGIN_DIR = path.join(ROOT, '.claude-plugin');
const BACKUP_CLAUDE = path.join(ROOT, '.claude-testing-123');
const BACKUP_PLUGIN = path.join(ROOT, '.claude-plugin-testing-123');
const SINGLE_TEST = path.join(__dirname, 'sync-claude-marketplace-test-a-single-condition.js');
const testStepsAll = [
  ['disabled', 'clean slate'],
  ['enabled', 'create files'],
  ['disabled', 'surgical remove'],
  ['enabled', 'surgical edit on existing'],
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
    if (fs.existsSync(BACKUP_CLAUDE)) fs.rmSync(BACKUP_CLAUDE, { recursive: true });
    if (fs.existsSync(BACKUP_PLUGIN)) fs.rmSync(BACKUP_PLUGIN, { recursive: true });
    renameIfExists(CLAUDE_DIR, BACKUP_CLAUDE);
    renameIfExists(PLUGIN_DIR, BACKUP_PLUGIN);
  } catch (e) {
    console.error('Backup failed:', e.message);
    if (fs.existsSync(BACKUP_CLAUDE)) fs.renameSync(BACKUP_CLAUDE, CLAUDE_DIR);
    if (fs.existsSync(BACKUP_PLUGIN)) fs.renameSync(BACKUP_PLUGIN, PLUGIN_DIR);
    process.exit(1);
  }

  let allPassed = true;
  for (const [mode, label] of testStepsAll) {
    const passed = runSingleCondition(mode);
    results.push({ step: label, mode, passed });
    if (!passed) allPassed = false;
  }

  try {
    if (fs.existsSync(CLAUDE_DIR)) {
      fs.rmSync(CLAUDE_DIR, { recursive: true });
    }
    if (fs.existsSync(PLUGIN_DIR)) {
      fs.rmSync(PLUGIN_DIR, { recursive: true });
    }
    renameIfExists(BACKUP_CLAUDE, CLAUDE_DIR);
    renameIfExists(BACKUP_PLUGIN, PLUGIN_DIR);
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
