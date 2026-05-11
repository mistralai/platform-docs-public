#!/usr/bin/env node
/**
 * Smart pre-build for `pnpm dev`.
 * Skips cookbook:build and rawmdx:export when their inputs have not changed,
 * saving 5-15s on hot dev restarts.
 *
 * Force a full rebuild with `FORCE_PREBUILD=1 pnpm dev` or `pnpm dev:full`.
 */
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const FORCE = process.env.FORCE_PREBUILD === '1';
const SCRIPT_VERSION = 2;
const TS_EXTS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json'];
const CONTENT_EXTS = ['.md', '.mdx', '.ipynb'];
const SKIP_DIRS = new Set([
  '.git',
  '.next',
  '.turbo',
  'node_modules',
  'public',
  'sdks',
]);

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function listFiles(paths, exts) {
  const files = [];

  function visit(p) {
    let stat;
    try {
      stat = statSync(p);
    } catch {
      return;
    }

    if (stat.isDirectory()) {
      if (SKIP_DIRS.has(path.basename(p))) return;
      for (const entry of readdirSync(p, { withFileTypes: true })) {
        visit(path.join(p, entry.name));
      }
      return;
    }

    if (!exts || exts.some(ext => p.endsWith(ext))) {
      files.push(p);
    }
  }

  for (const p of paths) visit(p);
  return files.sort();
}

function fingerprint(paths, exts, extra = []) {
  const hash = createHash('sha256');
  hash.update(`dev-prebuild-v${SCRIPT_VERSION}\n`);

  for (const item of extra.sort()) {
    hash.update(`${item}\n`);
  }

  for (const file of listFiles(paths, exts)) {
    const stat = statSync(file);
    hash.update(
      `${toPosix(path.relative(ROOT, file))}\t${stat.size}\t${Math.floor(
        stat.mtimeMs
      )}\n`
    );
  }

  return hash.digest('hex');
}

function run(label, cmd) {
  const start = Date.now();
  process.stdout.write(`▸ ${label} ... `);
  execSync(cmd, { stdio: ['ignore', 'inherit', 'inherit'] });
  process.stdout.write(`(${Date.now() - start}ms)\n`);
}

function isCurrent(output, stamp, value) {
  if (FORCE || !existsSync(output) || !existsSync(stamp)) return false;
  try {
    return readFileSync(stamp, 'utf8').trim() === value;
  } catch {
    return false;
  }
}

function writeStamp(stamp, value) {
  mkdirSync(path.dirname(stamp), { recursive: true });
  writeFileSync(stamp, `${value}\n`);
}

function readCookbookSourcePaths(configPath) {
  try {
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    if (!Array.isArray(config)) return { paths: [], invalid: true };

    return {
      invalid: false,
      paths: config
        .filter(entry => entry?.availableInDocs?.page === true)
        .map(entry => entry?.path)
        .filter(Boolean)
        .map(sourcePath => path.join(ROOT, 'static', 'cookbooks', sourcePath)),
    };
  } catch {
    return { paths: [], invalid: true };
  }
}

// --- cookbook:build ---
const cookbookConfig = path.join(ROOT, 'cookbooks.config.json');
const cookbookOutput = path.join(ROOT, 'public', 'complete-cookbook.json');
const cookbookStamp = path.join(ROOT, 'public', '.cookbook-built');
const cookbookSources = readCookbookSourcePaths(cookbookConfig);
const missingCookbookSources = cookbookSources.paths
  .filter(p => !existsSync(p))
  .map(p => `missing:${toPosix(path.relative(ROOT, p))}`);
const cookbookFingerprint = fingerprint(
  [
    cookbookConfig,
    ...cookbookSources.paths,
    path.join(ROOT, 'src', 'scripts', 'build-complete-cookbook.ts'),
    path.join(ROOT, 'src', 'lib', 'cookbook'),
    path.join(ROOT, 'src', 'schema', 'cookbook'),
  ],
  [...TS_EXTS, ...CONTENT_EXTS],
  missingCookbookSources
);

if (
  cookbookSources.invalid ||
  !isCurrent(cookbookOutput, cookbookStamp, cookbookFingerprint)
) {
  run('cookbook:build', 'pnpm -s cookbook:build');
  if (!cookbookSources.invalid) writeStamp(cookbookStamp, cookbookFingerprint);
} else {
  console.log('▸ cookbook:build  skipped (up to date)');
}

// --- rawmdx:export ---
// Output: public/<top-dir>.md or public/<top-dir>/<...>.md mirroring (docs)/
const rawMdxStamp = path.join(ROOT, 'public', '.rawmdx-built');
const rawMdxExportScript = fingerprint(
  [path.join(ROOT, 'src', 'scripts', 'export-raw-mdx.ts')],
  TS_EXTS
);
const rawMdxFingerprint = fingerprint(
  [path.join(ROOT, 'src', 'app', '(docs)')],
  ['.md', '.mdx'],
  [`export-raw-mdx:${rawMdxExportScript}`]
);

if (!isCurrent(rawMdxStamp, rawMdxStamp, rawMdxFingerprint)) {
  run('rawmdx:export', 'pnpm -s rawmdx:export');
  writeStamp(rawMdxStamp, rawMdxFingerprint);
} else {
  console.log('▸ rawmdx:export   skipped (up to date)');
}
