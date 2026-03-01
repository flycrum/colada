/**
 * Env-gated sync for Claude Code local marketplace.
 * When ENABLE_LOCAL_AGENT_CLAUDE=true: create or surgically update
 * .claude-plugin/marketplace.json and .claude/settings.json.
 * When false: surgically remove only our fields (clean slate).
 * Uses fast-json-patch (RFC 6902). Run from repo root.
 */

import pkg from 'fast-json-patch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const { applyPatch, validate } = pkg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MARKETPLACE_NAME = 'colada-plugins';
const PLUGINS_DIR = path.join(ROOT, '.agents', 'plugins');
/** Plugin dir names to exclude from all marketplace manifests (e.g. template/example only). */
const PLUGINS_EXCLUDED_FROM_MARKETPLACE = ['_plugin-example'];
const MARKETPLACE_FILE = path.join(ROOT, '.claude-plugin', 'marketplace.json');
const SETTINGS_FILE = path.join(ROOT, '.claude', 'settings.json');

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
    const manifestPath = path.join(PLUGINS_DIR, ent.name, '.claude-plugin', 'plugin.json');
    if (!fs.existsSync(manifestPath)) continue;
    let manifest;
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch {
      continue;
    }
    plugins.push({
      name: manifest.name ?? ent.name,
      source: `./.agents/plugins/${ent.name}`,
      description: manifest.description ?? '',
      version: manifest.version,
    });
  }
  return plugins.sort((a, b) => a.name.localeCompare(b.name));
}

function buildCanonicalMarketplace() {
  const plugins = discoverPlugins();
  return {
    name: MARKETPLACE_NAME,
    owner: { name: 'Colada' },
    plugins,
  };
}

function buildCanonicalSettings(pluginIds) {
  const enabledPlugins = {};
  for (const id of pluginIds) {
    enabledPlugins[`${id}@${MARKETPLACE_NAME}`] = true;
  }
  return {
    extraKnownMarketplaces: {
      [MARKETPLACE_NAME]: {
        source: { source: 'directory', path: ROOT },
      },
    },
    enabledPlugins,
  };
}

function applyOps(doc, ops) {
  if (ops.length === 0) return doc;
  const err = validate(ops);
  if (err) throw err;
  applyPatch(doc, ops, true, true);
  return doc;
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
    const ops = [
      { op: 'replace', path: '/name', value: canonical.name },
      { op: 'replace', path: '/owner', value: canonical.owner },
      { op: 'replace', path: '/plugins', value: canonical.plugins },
    ];
    applyOps(marketplace, ops);
    fs.writeFileSync(MARKETPLACE_FILE, JSON.stringify(marketplace, null, 2));
  }

  if (!fs.existsSync(SETTINGS_FILE)) {
    ensureDir(SETTINGS_FILE);
    const settings = buildCanonicalSettings(pluginIds);
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
  } else {
    const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    const canonicalSettings = buildCanonicalSettings(pluginIds);
    const enabledPlugins = { ...settings.enabledPlugins };
    for (const name of PLUGINS_EXCLUDED_FROM_MARKETPLACE) {
      delete enabledPlugins[`${name}@${MARKETPLACE_NAME}`];
    }
    Object.assign(enabledPlugins, canonicalSettings.enabledPlugins);
    const ops = [];
    ops.push({
      op: settings.extraKnownMarketplaces ? 'replace' : 'add',
      path: '/extraKnownMarketplaces',
      value: { ...settings.extraKnownMarketplaces, ...canonicalSettings.extraKnownMarketplaces },
    });
    ops.push({
      op: settings.enabledPlugins ? 'replace' : 'add',
      path: '/enabledPlugins',
      value: enabledPlugins,
    });
    applyOps(settings, ops);
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
  }
}

function disable() {
  if (fs.existsSync(MARKETPLACE_FILE)) {
    const marketplace = JSON.parse(fs.readFileSync(MARKETPLACE_FILE, 'utf8'));
    const isOurs =
      marketplace.name === MARKETPLACE_NAME &&
      Array.isArray(marketplace.plugins) &&
      Object.keys(marketplace).length <= 3;
    if (isOurs) {
      fs.unlinkSync(MARKETPLACE_FILE);
    } else {
      const ops = [];
      if (marketplace.name !== undefined) ops.push({ op: 'remove', path: '/name' });
      if (marketplace.owner !== undefined) ops.push({ op: 'remove', path: '/owner' });
      if (marketplace.plugins !== undefined) ops.push({ op: 'remove', path: '/plugins' });
      if (ops.length) {
        applyOps(marketplace, ops);
        fs.writeFileSync(MARKETPLACE_FILE, JSON.stringify(marketplace, null, 2));
      }
    }
  }

  if (fs.existsSync(SETTINGS_FILE)) {
    const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    const removeOps = [];
    if (
      settings.extraKnownMarketplaces &&
      settings.extraKnownMarketplaces[MARKETPLACE_NAME] !== undefined
    ) {
      delete settings.extraKnownMarketplaces[MARKETPLACE_NAME];
      if (Object.keys(settings.extraKnownMarketplaces).length === 0) {
        removeOps.push({ op: 'remove', path: '/extraKnownMarketplaces' });
      }
    }
    if (settings.enabledPlugins) {
      for (const key of Object.keys(settings.enabledPlugins)) {
        if (key.endsWith(`@${MARKETPLACE_NAME}`)) delete settings.enabledPlugins[key];
      }
      if (Object.keys(settings.enabledPlugins).length === 0) {
        removeOps.push({ op: 'remove', path: '/enabledPlugins' });
      }
    }
    for (const op of removeOps) {
      try {
        applyOps(settings, [op]);
      } catch {
        void 0; // Key may already be missing
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

function main() {
  const enabled = readEnv('ENABLE_LOCAL_AGENT_CLAUDE', 'false').toLowerCase() === 'true';
  if (enabled) enable();
  else disable();
}

main();
