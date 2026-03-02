/**
 * Env-gated sync for Cursor: populate .cursor/commands and .cursor/rules from .agents/plugins via symlinks.
 * When ENABLE_LOCAL_AGENT_CURSOR=true: create symlinks; when false: remove only our symlinks and manifest (clean slate).
 * Invoked by .githooks/post-merge and via pnpm run marketplace-cursor:sync. On any error exits 0.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const PLUGINS_DIR = path.join(ROOT, '.agents', 'plugins');
const CURSOR_DIR = path.join(ROOT, '.cursor');
const CURSOR_COMMANDS_DIR = path.join(CURSOR_DIR, 'commands');
const CURSOR_RULES_DIR = path.join(CURSOR_DIR, 'rules');
const MANIFEST_FILE = path.join(CURSOR_DIR, '.colada-cursor-sync.json');
const CURSOR_PLUGIN_SUBDIR = '.cursor-plugin';
const PLUGIN_MANIFEST_FILENAME = 'plugin.json';
const PLUGINS_EXCLUDED_FROM_SYNC = ['_plugin-example'];
const ENV_FILE = '.env';
const ENVRC_LOCAL = '.envrc.local';
const ENABLE_ARG_PREFIX = '--enable=';
const ENV_CURSOR_EXCLUDED_PLUGINS = 'CURSOR_EXCLUDED_PLUGINS';

function parseEnvLine(line, callerEnv) {
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
  for (const [key, value] of pairs) {
    if (!callerEnv.has(key)) process.env[key] = value;
  }
}

function loadLocalEnv() {
  const callerEnv = new Set(Object.keys(process.env));
  const envFiles = [path.join(ROOT, ENV_FILE), path.join(ROOT, ENVRC_LOCAL)];
  for (const file of envFiles) {
    if (!fs.existsSync(file)) continue;
    const raw = fs.readFileSync(file, 'utf8');
    for (const line of raw.split('\n')) parseEnvLine(line, callerEnv);
  }
}

function readEnv(key, def = 'false') {
  const v = process.env[key];
  return v === undefined || v === '' ? def : v;
}

function getExcludedPluginsFromEnv() {
  const raw = process.env[ENV_CURSOR_EXCLUDED_PLUGINS];
  if (raw === undefined || raw === '') return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function listPluginDirNames() {
  const excluded = [...PLUGINS_EXCLUDED_FROM_SYNC, ...getExcludedPluginsFromEnv()];
  const entries = fs.readdirSync(PLUGINS_DIR, { withFileTypes: true });
  const names = [];
  for (const ent of entries) {
    if (!ent.isDirectory()) continue;
    if (excluded.includes(ent.name)) continue;
    const manifestPath = path.join(
      PLUGINS_DIR,
      ent.name,
      CURSOR_PLUGIN_SUBDIR,
      PLUGIN_MANIFEST_FILENAME
    );
    if (fs.existsSync(manifestPath)) names.push(ent.name);
  }
  return names.sort((a, b) => a.localeCompare(b));
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function enable() {
  const created = { commands: [], rules: [] };
  const pluginNames = listPluginDirNames();

  ensureDir(CURSOR_COMMANDS_DIR);
  ensureDir(CURSOR_RULES_DIR);

  for (const pluginName of pluginNames) {
    const pluginPath = path.join(PLUGINS_DIR, pluginName);
    const commandsDir = path.join(pluginPath, 'commands');
    const rulesDir = path.join(pluginPath, 'rules');

    if (fs.existsSync(commandsDir)) {
      const files = fs.readdirSync(commandsDir).filter((f) => f.endsWith('.md'));
      for (const file of files) {
        const targetPath = path.join(commandsDir, file);
        const linkPath = path.join(CURSOR_COMMANDS_DIR, file);
        const relativeTarget = path.relative(path.dirname(linkPath), targetPath);
        if (fs.existsSync(linkPath)) fs.unlinkSync(linkPath);
        fs.symlinkSync(relativeTarget, linkPath);
        created.commands.push(path.relative(ROOT, linkPath));
      }
    }

    if (fs.existsSync(rulesDir)) {
      const files = fs.readdirSync(rulesDir).filter((f) => f.endsWith('.md'));
      if (files.length > 0) {
        const pluginRulesDir = path.join(CURSOR_RULES_DIR, pluginName);
        ensureDir(pluginRulesDir);
        for (const file of files) {
          const targetPath = path.join(rulesDir, file);
          const linkPath = path.join(pluginRulesDir, file);
          const relativeTarget = path.relative(path.dirname(linkPath), targetPath);
          if (fs.existsSync(linkPath)) fs.unlinkSync(linkPath);
          fs.symlinkSync(relativeTarget, linkPath);
          created.rules.push(path.relative(ROOT, linkPath));
        }
      }
    }
  }

  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(created, null, 2));
}

function disable() {
  if (!fs.existsSync(MANIFEST_FILE)) return;
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
  } catch {
    try {
      fs.unlinkSync(MANIFEST_FILE);
    } catch {
      void 0;
    }
    return;
  }
  const allPaths = [...(manifest.commands || []), ...(manifest.rules || [])];
  for (const rel of allPaths) {
    const full = path.join(ROOT, rel);
    try {
      if (fs.existsSync(full)) fs.unlinkSync(full);
    } catch {
      void 0;
    }
  }
  try {
    if (fs.existsSync(CURSOR_RULES_DIR)) {
      const pluginDirs = fs.readdirSync(CURSOR_RULES_DIR, { withFileTypes: true });
      for (const d of pluginDirs) {
        if (d.isDirectory()) {
          const sub = path.join(CURSOR_RULES_DIR, d.name);
          const entries = fs.readdirSync(sub);
          if (entries.length === 0) fs.rmdirSync(sub);
        }
      }
      const remaining = fs.readdirSync(CURSOR_RULES_DIR);
      if (remaining.length === 0) fs.rmdirSync(CURSOR_RULES_DIR);
    }
    if (fs.existsSync(CURSOR_COMMANDS_DIR)) {
      const remaining = fs.readdirSync(CURSOR_COMMANDS_DIR);
      if (remaining.length === 0) fs.rmdirSync(CURSOR_COMMANDS_DIR);
    }
    fs.unlinkSync(MANIFEST_FILE);
  } catch {
    void 0;
  }
}

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
        : readEnv('ENABLE_LOCAL_AGENT_CURSOR', 'false').toLowerCase() === 'true';
    if (enabled) enable();
    else disable();
  } catch {
    process.exit(0);
  }
}

main();
