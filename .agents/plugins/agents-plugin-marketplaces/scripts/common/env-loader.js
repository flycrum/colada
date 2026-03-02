/**
 * Shared env loading and CLI parsing for marketplace sync scripts.
 * Loads .env and .envrc.local from repo root; caller env wins over file.
 */

import fs from 'fs';
import path from 'path';

const ENV_FILE = '.env';
const ENVRC_LOCAL = '.envrc.local';
const ENABLE_ARG_PREFIX = '--enable=';

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

/**
 * Load .env and .envrc.local from root. Caller-set env is not overwritten.
 * @param {string} root - Repo root path
 */
export function loadLocalEnv(root) {
  const callerEnv = new Set(Object.keys(process.env));
  const envFiles = [path.join(root, ENV_FILE), path.join(root, ENVRC_LOCAL)];
  for (const file of envFiles) {
    if (!fs.existsSync(file)) continue;
    const raw = fs.readFileSync(file, 'utf8');
    for (const line of raw.split('\n')) parseEnvLine(line, callerEnv);
  }
}

/**
 * @param {string} key - Env var name
 * @param {string} [def='false'] - Default if missing/empty
 * @returns {string}
 */
export function readEnv(key, def = 'false') {
  const v = process.env[key];
  return v === undefined || v === '' ? def : v;
}

/**
 * Comma-separated plugin dir names from env. Only applied when enabled.
 * @param {string} envVarName - e.g. CLAUDE_EXCLUDED_PLUGINS, CURSOR_EXCLUDED_PLUGINS
 * @returns {string[]}
 */
export function getExcludedPluginsFromEnv(envVarName) {
  const raw = process.env[envVarName];
  if (raw === undefined || raw === '') return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Parse --enable=true|false from argv; overrides env when present.
 * @returns {boolean|null} true/false when arg present, null otherwise
 */
export function parseEnableArg() {
  const arg = process.argv.find((a) => a.startsWith(ENABLE_ARG_PREFIX));
  if (!arg) return null;
  const value = arg.slice(ENABLE_ARG_PREFIX.length).toLowerCase();
  return value === 'true';
}
