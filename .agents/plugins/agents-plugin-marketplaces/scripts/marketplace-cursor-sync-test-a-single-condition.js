/**
 * Runs marketplace-cursor-sync.js with a forced enable/disable and asserts the resulting
 * filesystem state. Not part of vitest; run via marketplace-cursor-sync-test-all-conditions.js
 * or directly: node .../marketplace-cursor-sync-test-a-single-condition.js <mode>
 * Modes: enabled | disabled | enabled-with-excluded-plugins | disabled-with-excluded-plugins
 */

import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const CURSOR_DIR = path.join(ROOT, '.cursor');
const CURSOR_COMMANDS_DIR = path.join(CURSOR_DIR, 'commands');
const CURSOR_RULES_DIR = path.join(CURSOR_DIR, 'rules');
const MANIFEST_FILE = path.join(CURSOR_DIR, '.colada-cursor-sync.json');
const SCRIPT = path.join(__dirname, 'marketplace-cursor-sync.js');
const TEST_EXCLUDED_PLUGINS = 'env-variables,turborepo';

function runSync(enable, envOverrides = null) {
  const env = envOverrides ? { ...process.env, ...envOverrides } : process.env;
  const result = spawnSync(process.execPath, [SCRIPT, `--enable=${enable}`], {
    cwd: ROOT,
    env,
    stdio: 'pipe',
    encoding: 'utf8',
  });
  return result;
}

function assertEnabled() {
  const errors = [];
  if (!fs.existsSync(MANIFEST_FILE)) {
    errors.push('.cursor/.colada-cursor-sync.json missing');
    return errors;
  }
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
  } catch (e) {
    errors.push(`manifest invalid: ${e.message}`);
    return errors;
  }
  if (!Array.isArray(manifest.commands)) {
    errors.push('manifest.commands missing or not array');
  } else if (manifest.commands.length === 0) {
    errors.push('manifest.commands empty (expected at least one plugin command)');
  }
  if (!fs.existsSync(CURSOR_COMMANDS_DIR)) {
    errors.push('.cursor/commands missing');
  } else {
    const entries = fs.readdirSync(CURSOR_COMMANDS_DIR);
    if (entries.length === 0) {
      errors.push('.cursor/commands empty');
    }
  }
  return errors;
}

function assertEnabledWithExclusions() {
  const errors = assertEnabled();
  if (errors.length > 0) return errors;
  const excludedNames = TEST_EXCLUDED_PLUGINS.split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  for (const name of excludedNames) {
    const rulePath = path.join(CURSOR_RULES_DIR, name);
    if (fs.existsSync(rulePath)) {
      errors.push(`.cursor/rules/${name} should not exist when excluded`);
    }
  }
  return errors;
}

function assertDisabled() {
  const errors = [];
  if (fs.existsSync(MANIFEST_FILE)) {
    errors.push('.cursor/.colada-cursor-sync.json should not exist when disabled');
  }
  return errors;
}

const VALID_MODES = [
  'enabled',
  'disabled',
  'enabled-with-excluded-plugins',
  'disabled-with-excluded-plugins',
];

function main() {
  const arg = process.argv[2];
  if (!VALID_MODES.includes(arg)) {
    console.error(
      `Usage: node marketplace-cursor-sync-test-a-single-condition.js <${VALID_MODES.join('|')}>`
    );
    process.exit(1);
  }
  const withExclusions = arg.endsWith('-with-excluded-plugins');
  const enable = arg.startsWith('enabled');
  const envOverrides = withExclusions
    ? { CURSOR_EXCLUDED_PLUGINS: TEST_EXCLUDED_PLUGINS }
    : { CURSOR_EXCLUDED_PLUGINS: '' };
  const result = runSync(enable, envOverrides);
  if (result.status !== 0) {
    console.error('marketplace-cursor-sync.js exited with', result.status);
    if (result.stderr) console.error(result.stderr);
    process.exit(1);
  }
  let errors = [];
  if (arg === 'enabled') errors = assertEnabled();
  else if (arg === 'enabled-with-excluded-plugins') errors = assertEnabledWithExclusions();
  else errors = assertDisabled();
  if (errors.length > 0) {
    console.error(`Assertions failed (${arg}):`, errors);
    process.exit(1);
  }
  process.exit(0);
}

main();
