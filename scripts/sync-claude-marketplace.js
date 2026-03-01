/**
 * Env-gated sync for Claude Code local marketplace.
 * When ENABLE_LOCAL_AGENT_CLAUDE=true: create or surgically update
 * .claude-plugin/marketplace.json and .claude/settings.json.
 * When false: surgically remove only our fields (clean slate).
 * Invoked by .githooks/post-merge (after git pull) and via pnpm run sync:claude-marketplace.
 * Uses only Node built-ins (no deps). On any error exits 0 so the caller never fails.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MARKETPLACE_NAME = 'colada-plugins';
const PLUGINS_DIR = path.join(ROOT, '.agents', 'plugins');
/** Plugin dir names to exclude from all marketplace manifests (e.g. template/example only). */
const PLUGINS_EXCLUDED_FROM_MARKETPLACE = ['_plugin-example'];
const MARKETPLACE_FILE = path.join(ROOT, '.claude-plugin', 'marketplace.json');
const SETTINGS_FILE = path.join(ROOT, '.claude', 'settings.json');
const CLAUDE_PLUGIN_SUBDIR = '.claude-plugin';
const PLUGIN_MANIFEST_FILENAME = 'plugin.json';
const PLUGIN_SOURCE_PREFIX = './.agents/plugins/';
const OWNER_NAME = 'Colada';
const SOURCE_TYPE_DIRECTORY = 'directory';
const SETTINGS_KEY_EXTRA_KNOWN_MARKETPLACES = 'extraKnownMarketplaces';
const SETTINGS_KEY_ENABLED_PLUGINS = 'enabledPlugins';
const MARKETPLACE_KEY_NAME = 'name';
const MARKETPLACE_KEY_OWNER = 'owner';
const MARKETPLACE_KEY_PLUGINS = 'plugins';
/** Number of top-level keys in our canonical marketplace JSON (name, owner, plugins). */
const CANONICAL_MARKETPLACE_KEYS_COUNT = 3;
const ENV_FILE = '.env';
const ENVRC_LOCAL = '.envrc.local';
const ENABLE_ARG_PREFIX = '--enable=';

/** Load .env and .envrc.local from repo root so script uses current file state (not parent env only). */
function loadLocalEnv() {
  const envFiles = [path.join(ROOT, ENV_FILE), path.join(ROOT, ENVRC_LOCAL)];
  for (const file of envFiles) {
    if (!fs.existsSync(file)) continue;
    const raw = fs.readFileSync(file, 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const exportMatch = trimmed.match(/^export\s+([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      const plainMatch = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      const match = exportMatch || plainMatch;
      if (match) {
        const key = match[1];
        let value = match[2].trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    }
  }
}

function readEnv(key, def = 'false') {
  const v = process.env[key];
  return v === undefined || v === '' ? def : v;
}

function discoverPlugins() {
  const entries = fs.readdirSync(PLUGINS_DIR, { withFileTypes: true });
  const plugins = [];
  for (const ent of entries) {
    if (!ent.isDirectory()) continue;
    if (PLUGINS_EXCLUDED_FROM_MARKETPLACE.includes(ent.name)) continue;
    const manifestPath = path.join(
      PLUGINS_DIR,
      ent.name,
      CLAUDE_PLUGIN_SUBDIR,
      PLUGIN_MANIFEST_FILENAME
    );
    if (!fs.existsSync(manifestPath)) continue;
    let manifest;
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch {
      continue;
    }
    plugins.push({
      name: manifest.name ?? ent.name,
      source: `${PLUGIN_SOURCE_PREFIX}${ent.name}`,
      description: manifest.description ?? '',
      version: manifest.version,
    });
  }
  return plugins.sort((a, b) => a.name.localeCompare(b.name));
}

function buildCanonicalMarketplace() {
  const plugins = discoverPlugins();
  return {
    [MARKETPLACE_KEY_NAME]: MARKETPLACE_NAME,
    [MARKETPLACE_KEY_OWNER]: { [MARKETPLACE_KEY_NAME]: OWNER_NAME },
    [MARKETPLACE_KEY_PLUGINS]: plugins,
  };
}

function buildCanonicalSettings(pluginIds) {
  const enabledPlugins = {};
  for (const id of pluginIds) {
    enabledPlugins[`${id}@${MARKETPLACE_NAME}`] = true;
  }
  return {
    [SETTINGS_KEY_EXTRA_KNOWN_MARKETPLACES]: {
      [MARKETPLACE_NAME]: {
        source: { source: SOURCE_TYPE_DIRECTORY, path: ROOT },
      },
    },
    [SETTINGS_KEY_ENABLED_PLUGINS]: enabledPlugins,
  };
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function enable() {
  const plugins = discoverPlugins();
  const pluginIds = plugins.map((p) => p.name);

  if (!fs.existsSync(MARKETPLACE_FILE)) {
    ensureDir(MARKETPLACE_FILE);
    const marketplace = buildCanonicalMarketplace();
    fs.writeFileSync(MARKETPLACE_FILE, JSON.stringify(marketplace, null, 2));
  } else {
    const marketplace = JSON.parse(fs.readFileSync(MARKETPLACE_FILE, 'utf8'));
    const canonical = buildCanonicalMarketplace();
    marketplace[MARKETPLACE_KEY_NAME] = canonical[MARKETPLACE_KEY_NAME];
    marketplace[MARKETPLACE_KEY_OWNER] = canonical[MARKETPLACE_KEY_OWNER];
    marketplace[MARKETPLACE_KEY_PLUGINS] = canonical[MARKETPLACE_KEY_PLUGINS];
    fs.writeFileSync(MARKETPLACE_FILE, JSON.stringify(marketplace, null, 2));
  }

  if (!fs.existsSync(SETTINGS_FILE)) {
    ensureDir(SETTINGS_FILE);
    const settings = buildCanonicalSettings(pluginIds);
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
  } else {
    const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    const canonicalSettings = buildCanonicalSettings(pluginIds);
    const enabledPlugins = { ...settings[SETTINGS_KEY_ENABLED_PLUGINS] };
    for (const name of PLUGINS_EXCLUDED_FROM_MARKETPLACE) {
      delete enabledPlugins[`${name}@${MARKETPLACE_NAME}`];
    }
    Object.assign(enabledPlugins, canonicalSettings[SETTINGS_KEY_ENABLED_PLUGINS]);
    settings[SETTINGS_KEY_EXTRA_KNOWN_MARKETPLACES] = {
      ...settings[SETTINGS_KEY_EXTRA_KNOWN_MARKETPLACES],
      ...canonicalSettings[SETTINGS_KEY_EXTRA_KNOWN_MARKETPLACES],
    };
    settings[SETTINGS_KEY_ENABLED_PLUGINS] = enabledPlugins;
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
  }
}

function disable() {
  if (fs.existsSync(MARKETPLACE_FILE)) {
    const marketplace = JSON.parse(fs.readFileSync(MARKETPLACE_FILE, 'utf8'));
    const isOurs =
      marketplace[MARKETPLACE_KEY_NAME] === MARKETPLACE_NAME &&
      Array.isArray(marketplace[MARKETPLACE_KEY_PLUGINS]) &&
      Object.keys(marketplace).length <= CANONICAL_MARKETPLACE_KEYS_COUNT;
    if (isOurs) {
      fs.unlinkSync(MARKETPLACE_FILE);
    } else {
      delete marketplace[MARKETPLACE_KEY_NAME];
      delete marketplace[MARKETPLACE_KEY_OWNER];
      delete marketplace[MARKETPLACE_KEY_PLUGINS];
      fs.writeFileSync(MARKETPLACE_FILE, JSON.stringify(marketplace, null, 2));
    }
  }

  if (fs.existsSync(SETTINGS_FILE)) {
    const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    if (
      settings[SETTINGS_KEY_EXTRA_KNOWN_MARKETPLACES] &&
      settings[SETTINGS_KEY_EXTRA_KNOWN_MARKETPLACES][MARKETPLACE_NAME] !== undefined
    ) {
      delete settings[SETTINGS_KEY_EXTRA_KNOWN_MARKETPLACES][MARKETPLACE_NAME];
      if (Object.keys(settings[SETTINGS_KEY_EXTRA_KNOWN_MARKETPLACES]).length === 0) {
        delete settings[SETTINGS_KEY_EXTRA_KNOWN_MARKETPLACES];
      }
    }
    if (settings[SETTINGS_KEY_ENABLED_PLUGINS]) {
      for (const key of Object.keys(settings[SETTINGS_KEY_ENABLED_PLUGINS])) {
        if (key.endsWith(`@${MARKETPLACE_NAME}`))
          delete settings[SETTINGS_KEY_ENABLED_PLUGINS][key];
      }
      if (Object.keys(settings[SETTINGS_KEY_ENABLED_PLUGINS]).length === 0) {
        delete settings[SETTINGS_KEY_ENABLED_PLUGINS];
      }
    }
    const keys = Object.keys(settings).filter((k) => settings[k] !== undefined);
    if (keys.length === 0) {
      fs.unlinkSync(SETTINGS_FILE);
    } else {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    }
  }
}

/** Parse --enable=true|false from argv; overrides env when present. */
function parseEnableArg() {
  const arg = process.argv.find((a) => a.startsWith(ENABLE_ARG_PREFIX));
  if (!arg) return null;
  const value = arg.slice(ENABLE_ARG_PREFIX.length).toLowerCase();
  return value === 'true';
}

function main() {
  try {
    loadLocalEnv();
    const forceEnable = parseEnableArg();
    const enabled =
      forceEnable !== null
        ? forceEnable
        : readEnv('ENABLE_LOCAL_AGENT_CLAUDE', 'false').toLowerCase() === 'true';
    if (enabled) enable();
    else disable();
  } catch {
    process.exit(0);
  }
}

main();
