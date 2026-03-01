/**
 * Runs sync-claude-marketplace.js with a forced enable/disable and asserts the resulting
 * filesystem state. Not part of vitest; run via sync-claude-marketplace-test-all-conditions.js
 * or directly: node .agents/plugins/agents-plugin-marketplaces/scripts/sync-claude-marketplace-test-a-single-condition.js <enabled|disabled>
 */

import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** Repo root: script lives at .agents/plugins/agents-plugin-marketplaces/scripts/ */
const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const MARKETPLACE_NAME = 'colada-plugins';
const MARKETPLACE_FILE = path.join(ROOT, '.claude-plugin', 'marketplace.json');
const SETTINGS_FILE = path.join(ROOT, '.claude', 'settings.json');
const SCRIPT = path.join(__dirname, 'sync-claude-marketplace.js');
const SETTINGS_KEY_EXTRA_KNOWN_MARKETPLACES = 'extraKnownMarketplaces';
const SETTINGS_KEY_ENABLED_PLUGINS = 'enabledPlugins';
const MARKETPLACE_KEY_NAME = 'name';
const MARKETPLACE_KEY_PLUGINS = 'plugins';

function runSync(enable) {
  const result = spawnSync(process.execPath, [SCRIPT, `--enable=${enable}`], {
    cwd: ROOT,
    stdio: 'pipe',
    encoding: 'utf8',
  });
  return result;
}

function assertEnabled() {
  const errors = [];
  if (!fs.existsSync(MARKETPLACE_FILE)) {
    errors.push('.claude-plugin/marketplace.json missing');
    return errors;
  }
  let marketplace;
  try {
    marketplace = JSON.parse(fs.readFileSync(MARKETPLACE_FILE, 'utf8'));
  } catch (e) {
    errors.push(`marketplace.json invalid: ${e.message}`);
    return errors;
  }
  if (marketplace[MARKETPLACE_KEY_NAME] !== MARKETPLACE_NAME) {
    errors.push(
      `marketplace.json name expected "${MARKETPLACE_NAME}", got "${marketplace[MARKETPLACE_KEY_NAME]}"`
    );
  }
  if (
    !Array.isArray(marketplace[MARKETPLACE_KEY_PLUGINS]) ||
    marketplace[MARKETPLACE_KEY_PLUGINS].length === 0
  ) {
    errors.push('marketplace.json plugins missing or empty');
  }

  if (!fs.existsSync(SETTINGS_FILE)) {
    errors.push('.claude/settings.json missing');
    return errors;
  }
  let settings;
  try {
    settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
  } catch (e) {
    errors.push(`settings.json invalid: ${e.message}`);
    return errors;
  }
  if (!settings[SETTINGS_KEY_EXTRA_KNOWN_MARKETPLACES]?.[MARKETPLACE_NAME]) {
    errors.push(
      `settings.json ${SETTINGS_KEY_EXTRA_KNOWN_MARKETPLACES}.${MARKETPLACE_NAME} missing`
    );
  }
  if (
    !settings[SETTINGS_KEY_ENABLED_PLUGINS] ||
    typeof settings[SETTINGS_KEY_ENABLED_PLUGINS] !== 'object'
  ) {
    errors.push(`settings.json ${SETTINGS_KEY_ENABLED_PLUGINS} missing or not object`);
  } else {
    const coladaPlugins = Object.keys(settings[SETTINGS_KEY_ENABLED_PLUGINS]).filter((k) =>
      k.endsWith(`@${MARKETPLACE_NAME}`)
    );
    if (coladaPlugins.length === 0) {
      errors.push(
        `settings.json has no ${SETTINGS_KEY_ENABLED_PLUGINS} entries for colada-plugins`
      );
    }
  }
  return errors;
}

function assertDisabled() {
  const errors = [];
  if (fs.existsSync(MARKETPLACE_FILE)) {
    errors.push('.claude-plugin/marketplace.json should not exist when disabled');
  }
  const pluginDir = path.dirname(MARKETPLACE_FILE);
  if (fs.existsSync(pluginDir)) {
    const entries = fs.readdirSync(pluginDir);
    if (entries.length > 0) {
      errors.push('.claude-plugin should be empty or missing when disabled');
    }
  }

  if (fs.existsSync(SETTINGS_FILE)) {
    let settings;
    try {
      settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    } catch {
      return errors;
    }
    if (settings[SETTINGS_KEY_EXTRA_KNOWN_MARKETPLACES]?.[MARKETPLACE_NAME]) {
      errors.push(
        `settings.json should not have ${SETTINGS_KEY_EXTRA_KNOWN_MARKETPLACES}.${MARKETPLACE_NAME} when disabled`
      );
    }
    const coladaPlugins = Object.keys(settings[SETTINGS_KEY_ENABLED_PLUGINS] || {}).filter((k) =>
      k.endsWith(`@${MARKETPLACE_NAME}`)
    );
    if (coladaPlugins.length > 0) {
      errors.push(
        `settings.json should have no ${SETTINGS_KEY_ENABLED_PLUGINS} *@colada-plugins when disabled`
      );
    }
  }
  return errors;
}

function main() {
  const arg = process.argv[2];
  if (arg !== 'enabled' && arg !== 'disabled') {
    console.error(
      'Usage: node sync-claude-marketplace-test-a-single-condition.js <enabled|disabled>'
    );
    process.exit(1);
  }
  const forceEnable = arg === 'enabled';
  const result = runSync(forceEnable);
  if (result.status !== 0) {
    console.error('sync-claude-marketplace.js exited with', result.status);
    if (result.stderr) console.error(result.stderr);
    process.exit(1);
  }
  const errors = forceEnable ? assertEnabled() : assertDisabled();
  if (errors.length > 0) {
    console.error(`Assertions failed (${arg}):`, errors);
    process.exit(1);
  }
  process.exit(0);
}

main();
