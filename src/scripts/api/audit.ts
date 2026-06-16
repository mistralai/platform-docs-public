/**
 * Default audit dispatcher.
 *
 *   pnpm api:audit           → MDX-driven (recommended; requires fresh MDX)
 *   pnpm api:audit --legacy  → endpoint-walk (no MDX needed; coarser)
 */

import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const argv = process.argv.slice(2);
const useLegacy = argv.includes('--legacy');
const passThrough = argv.filter(a => a !== '--legacy');

const script = useLegacy ? 'audit-legacy.ts' : 'audit-mdx.ts';
const path = resolve(import.meta.dirname || __dirname, script);

const result = spawnSync('pnpm', ['exec', 'tsx', path, ...passThrough], { stdio: 'inherit' });
process.exit(result.status ?? 0);
