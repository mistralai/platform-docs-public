/**
 * End-to-end orchestrator for generating the API reference docs.
 *
 *   1. apply V2 patches -> .openapi-docs.yaml
 *   2. docs-md (V2)     -> src/content/en/api/**
 *   3. apply V1 patches -> .openapi-docs.v1.yaml
 *   4. docs-md (V1)     -> src/app/(api)/api-v1-temp/**
 *   5. merge SDK tabs   -> src/content/en/api/** (V1+V2 wrapped)
 *
 * Replaces the legacy `pnpm build-api-docs` chain.
 *
 * Flags:
 *   --skip-v1       Skip V1 generation + merge step (faster, dev only).
 *   --skip-apply    Reuse existing .openapi-docs.yaml.
 *   --strict        After V2 build, run audit-mdx and fail (exit 1) if any
 *                   non-ignored CRITICAL findings remain. Use in CI.
 *   --no-clean      Don't delete the generated endpoint/ tree before docs-md.
 *                   By default it's purged so endpoints removed/renamed upstream
 *                   don't linger (docs-md never prunes stale pages).
 */

import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';

// Mirror speakeasy.config.mjs so the purge targets the dir docs-md writes to.
const PAGE_OUT_DIR = process.env.API_PAGE_OUT_DIR || './src/content/en/api';
const V2_SPEC = './.openapi-docs.yaml';
const V1_SPEC = './.openapi-docs.v1.yaml';

type CliFlags = {
  skipV1: boolean;
  skipApply: boolean;
  strict: boolean;
  clean: boolean;
};

function parseArgs(argv: string[]): CliFlags {
  const flags: CliFlags = { skipV1: false, skipApply: false, strict: false, clean: true };
  for (const arg of argv) {
    if (arg === '--skip-v1') flags.skipV1 = true;
    else if (arg === '--skip-apply') flags.skipApply = true;
    else if (arg === '--strict') flags.strict = true;
    else if (arg === '--no-clean') flags.clean = false;
    else if (arg === '--help' || arg === '-h') {
      console.log(
        'Usage: tsx src/scripts/api/build.ts [--skip-v1] [--skip-apply] [--strict] [--no-clean]'
      );
      process.exit(0);
    } else {
      throw new Error(`Unknown flag: ${arg}`);
    }
  }
  return flags;
}

function step(label: string, command: string, args: string[], env?: Record<string, string>) {
  console.log('');
  console.log(`▸ ${label}`);
  console.log(`  $ ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    env: env ? { ...process.env, ...env } : process.env,
  });
  if (result.status !== 0) {
    console.error(`Step failed: ${label}`);
    process.exit(result.status ?? 1);
  }
}

// docs-md writes one page per current tag but never deletes pages for tags that
// were removed/renamed upstream. Purge the generated endpoint/ tree before a
// build so those orphans don't linger. _i18n/ and sidebar-metadata.json are kept.
function clean(dir: string) {
  console.log('');
  console.log('▸ clean generated endpoint pages');
  console.log(`  $ rm -rf ${dir}`);
  rmSync(dir, { recursive: true, force: true });
}

function main() {
  const flags = parseArgs(process.argv.slice(2));

  if (!flags.skipApply) {
    step('apply patches (V2)', 'pnpm', ['exec', 'tsx', 'src/scripts/api/apply.ts'], {
      API_OUTPUT_SPEC: V2_SPEC,
      API_CODE_SAMPLES_PATCH_DB: './src/scripts/api-code-samples.v2.yaml',
    });
  }

  if (flags.clean) {
    clean(`${PAGE_OUT_DIR}/endpoint`);
  }

  step('docs-md (V2)', 'pnpm', ['exec', 'docs-md'], {
    SPEAKEASY_OPENAPI_YAML: V2_SPEC,
  });

  step('post-process MDX (V2)', 'pnpm', ['exec', 'tsx', 'src/scripts/api/postprocess-mdx.ts']);

  if (flags.strict) {
    step('audit (strict)', 'pnpm', ['exec', 'tsx', 'src/scripts/api/audit-mdx.ts', '--strict']);
  }

  if (!flags.skipV1) {
    if (!flags.skipApply) {
      step('apply patches (V1)', 'pnpm', ['exec', 'tsx', 'src/scripts/api/apply.ts'], {
        API_OUTPUT_SPEC: V1_SPEC,
        API_CODE_SAMPLES_PATCH_DB: './src/scripts/api-code-samples.v1.yaml',
      });
    }
    step('docs-md (V1)', 'pnpm', ['exec', 'docs-md', '-c', 'speakeasy.v1.config.mjs'], {
      SPEAKEASY_OPENAPI_YAML: V1_SPEC,
    });
    step('merge SDK versions', 'pnpm', ['exec', 'tsx', 'src/scripts/merge-api-sdk-versions.ts']);
  }

  console.log('');
  console.log('✓ API docs build complete');
}

main();
