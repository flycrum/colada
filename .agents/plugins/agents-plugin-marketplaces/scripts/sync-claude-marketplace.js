/**
 * Env-gated sync for Claude Code local marketplace.
 * When ENABLE_LOCAL_AGENT_CLAUDE=true: create or surgically update
 * .claude-plugin/marketplace.json and .claude/settings.json.
 * When false: surgically remove only our fields (clean slate).
 * Invoked by .githooks/post-merge (after git pull) and via pnpm run marketplace-claude-sync.
 * Uses fast-json-patch (RFC 6902) for surgical edits. On any error exits 0 so the caller never fails.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** Repo root: script lives at .agents/plugins/agents-plugin-marketplaces/scripts/ */
const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
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
/** Env var for comma-separated plugin dir names to exclude (only when enabled). Ignored when ENABLE_LOCAL_AGENT_CLAUDE=false. */
const ENV_CLAUDE_EXCLUDED_PLUGINS = 'CLAUDE_EXCLUDED_PLUGINS';

/** Parse one or more KEY=value pairs from a line (handles "export A=b C=d" or "A=b"). */
function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  let rest = trimmed;
  if (rest.startsWith('export ')) rest = rest.slice(7).trim();
  const pairs = [];
  while (rest.length > 0) {
    const keyMatch = rest.match(/^([A-Za-z_][A-Za-z0-9_]*)=/);
    if (!keyMatch) break;
    const key = keyMatch[1];
    rest = rest.slice(keyMatch[0].length);
    let value;
    if (rest.startsWith('"')) {
      const end = rest.indexOf('"', 1);
      value = end === -1 ? rest : rest.slice(1, end);
      rest = end === -1 ? '' : rest.slice(end + 1).trim();
    } else if (rest.startsWith("'")) {
      const end = rest.indexOf("'", 1);
      value = end === -1 ? rest : rest.slice(1, end);
      rest = end === -1 ? '' : rest.slice(end + 1).trim();
    } else {
      const unquoted = rest.match(/^(\S+)/);
      value = unquoted ? unquoted[1] : rest;
      rest = unquoted ? rest.slice(unquoted[1].length).trim() : '';
    }
    pairs.push([key, value]);
  }
  for (const [key, value] of pairs) process.env[key] = value;
}

/** Load .env and .envrc.local from repo root so script uses current file state (not parent env only). */
function loadLocalEnv() {
  const envFiles = [path.join(ROOT, ENV_FILE), path.join(ROOT, ENVRC_LOCAL)];
  for (const file of envFiles) {
    if (!fs.existsSync(file)) continue;
    const raw = fs.readFileSync(file, 'utf8');
    for (const line of raw.split('\n')) parseEnvLine(line);
  }
}

function readEnv(key, def = 'false') {
  const v = process.env[key];
  return v === undefined || v === '' ? def : v;
}

/** Plugin dir names from CLAUDE_EXCLUDED_PLUGINS (comma-separated). Only applied when enabled; safe to set when disabled. */
function getExcludedPluginsFromEnv() {
  const raw = process.env[ENV_CLAUDE_EXCLUDED_PLUGINS];
  if (raw === undefined || raw === '') return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Set of plugin dir names that exist under PLUGINS_DIR with .claude-plugin/plugin.json (excluding only hardcoded list). */
function listActualPluginDirNames() {
  const entries = fs.readdirSync(PLUGINS_DIR, { withFileTypes: true });
  const names = new Set();
  for (const ent of entries) {
    if (!ent.isDirectory()) continue;
    if (PLUGINS_EXCLUDED_FROM_MARKETPLACE.includes(ent.name)) continue;
    const manifestPath = path.join(
      PLUGINS_DIR,
      ent.name,
      CLAUDE_PLUGIN_SUBDIR,
      PLUGIN_MANIFEST_FILENAME
    );
    if (fs.existsSync(manifestPath)) names.add(ent.name);
  }
  return names;
}

/** Report CLAUDE_EXCLUDED_PLUGINS names that are not found (typo, renamed). Non-existent names are allowed; we only report. */
function reportUnknownExcludedPlugins() {
  const fromEnv = getExcludedPluginsFromEnv();
  if (fromEnv.length === 0) return;
  const actual = listActualPluginDirNames();
  const unknown = fromEnv.filter((name) => !actual.has(name));
  if (unknown.length > 0) {
    process.stderr.write(
      `CLAUDE_EXCLUDED_PLUGINS: unknown or non-existent plugin name(s) (typo/renamed?): ${unknown.join(', ')}\n`
    );
  }
}

function discoverPlugins() {
  const excluded = [...PLUGINS_EXCLUDED_FROM_MARKETPLACE, ...getExcludedPluginsFromEnv()];
  const entries = fs.readdirSync(PLUGINS_DIR, { withFileTypes: true });
  const plugins = [];
  for (const ent of entries) {
    if (!ent.isDirectory()) continue;
    if (excluded.includes(ent.name)) continue;
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

function applyOps(doc, ops, { applyPatch, validate }) {
  if (ops.length === 0) return doc;
  const err = validate(ops);
  if (err) throw err;
  const result = applyPatch(doc, ops, true, true);
  return result.newDocument !== undefined ? result.newDocument : doc;
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function enable(patch) {
  const plugins = discoverPlugins();
  const pluginIds = plugins.map((p) => p.name);

  if (!fs.existsSync(MARKETPLACE_FILE)) {
    ensureDir(MARKETPLACE_FILE);
    const marketplace = buildCanonicalMarketplace();
    fs.writeFileSync(MARKETPLACE_FILE, JSON.stringify(marketplace, null, 2));
  } else {
    const marketplace = JSON.parse(fs.readFileSync(MARKETPLACE_FILE, 'utf8'));
    const canonical = buildCanonicalMarketplace();
    const ops = [
      { op: 'replace', path: `/${MARKETPLACE_KEY_NAME}`, value: canonical[MARKETPLACE_KEY_NAME] },
      { op: 'replace', path: `/${MARKETPLACE_KEY_OWNER}`, value: canonical[MARKETPLACE_KEY_OWNER] },
      {
        op: 'replace',
        path: `/${MARKETPLACE_KEY_PLUGINS}`,
        value: canonical[MARKETPLACE_KEY_PLUGINS],
      },
    ];
    const patched = applyOps(marketplace, ops, patch);
    fs.writeFileSync(MARKETPLACE_FILE, JSON.stringify(patched, null, 2));
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
    const ops = [];
    ops.push({
      op: settings[SETTINGS_KEY_EXTRA_KNOWN_MARKETPLACES] ? 'replace' : 'add',
      path: `/${SETTINGS_KEY_EXTRA_KNOWN_MARKETPLACES}`,
      value: {
        ...settings[SETTINGS_KEY_EXTRA_KNOWN_MARKETPLACES],
        ...canonicalSettings[SETTINGS_KEY_EXTRA_KNOWN_MARKETPLACES],
      },
    });
    ops.push({
      op: settings[SETTINGS_KEY_ENABLED_PLUGINS] ? 'replace' : 'add',
      path: `/${SETTINGS_KEY_ENABLED_PLUGINS}`,
      value: enabledPlugins,
    });
    const patched = applyOps(settings, ops, patch);
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(patched, null, 2));
  }
}

function disable(patch) {
  if (fs.existsSync(MARKETPLACE_FILE)) {
    const marketplace = JSON.parse(fs.readFileSync(MARKETPLACE_FILE, 'utf8'));
    const isOurs =
      marketplace[MARKETPLACE_KEY_NAME] === MARKETPLACE_NAME &&
      Array.isArray(marketplace[MARKETPLACE_KEY_PLUGINS]) &&
      Object.keys(marketplace).length <= CANONICAL_MARKETPLACE_KEYS_COUNT;
    if (isOurs) {
      fs.unlinkSync(MARKETPLACE_FILE);
    } else {
      const ops = [];
      if (marketplace[MARKETPLACE_KEY_NAME] !== undefined)
        ops.push({ op: 'remove', path: `/${MARKETPLACE_KEY_NAME}` });
      if (marketplace[MARKETPLACE_KEY_OWNER] !== undefined)
        ops.push({ op: 'remove', path: `/${MARKETPLACE_KEY_OWNER}` });
      if (marketplace[MARKETPLACE_KEY_PLUGINS] !== undefined)
        ops.push({ op: 'remove', path: `/${MARKETPLACE_KEY_PLUGINS}` });
      if (ops.length) {
        applyOps(marketplace, ops, patch);
        fs.writeFileSync(MARKETPLACE_FILE, JSON.stringify(marketplace, null, 2));
      }
    }
  }

  if (fs.existsSync(SETTINGS_FILE)) {
    const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    const removeOps = [];
    if (
      settings[SETTINGS_KEY_EXTRA_KNOWN_MARKETPLACES] &&
      settings[SETTINGS_KEY_EXTRA_KNOWN_MARKETPLACES][MARKETPLACE_NAME] !== undefined
    ) {
      delete settings[SETTINGS_KEY_EXTRA_KNOWN_MARKETPLACES][MARKETPLACE_NAME];
      if (Object.keys(settings[SETTINGS_KEY_EXTRA_KNOWN_MARKETPLACES]).length === 0) {
        removeOps.push({
          op: 'remove',
          path: `/${SETTINGS_KEY_EXTRA_KNOWN_MARKETPLACES}`,
        });
      }
    }
    if (settings[SETTINGS_KEY_ENABLED_PLUGINS]) {
      for (const key of Object.keys(settings[SETTINGS_KEY_ENABLED_PLUGINS])) {
        if (key.endsWith(`@${MARKETPLACE_NAME}`))
          delete settings[SETTINGS_KEY_ENABLED_PLUGINS][key];
      }
      if (Object.keys(settings[SETTINGS_KEY_ENABLED_PLUGINS]).length === 0) {
        removeOps.push({ op: 'remove', path: `/${SETTINGS_KEY_ENABLED_PLUGINS}` });
      }
    }
    for (const op of removeOps) {
      try {
        applyOps(settings, [op], patch);
      } catch {
        void 0;
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

async function main() {
  try {
    const pkg = await import('fast-json-patch');
    const api = pkg.default || pkg;
    const patch = { applyPatch: api.applyPatch, validate: api.validate };
    loadLocalEnv();
    const forceEnable = parseEnableArg();
    const enabled =
      forceEnable !== null
        ? forceEnable
        : readEnv('ENABLE_LOCAL_AGENT_CLAUDE', 'false').toLowerCase() === 'true';
    if (enabled) {
      reportUnknownExcludedPlugins();
      enable(patch);
    } else disable(patch);
  } catch {
    process.exit(0);
  }
}

main();
