/**
 * Generate the French API reference from a translated spec (Plan A).
 *
 * Pipeline:
 *   1. apply            -> ./.openapi-docs.yaml          (unless --skip-apply)
 *   2. extract strings  -> src/content/en/api/_i18n/strings.json
 *   3. load FR catalog  -> src/content/fr/api/_i18n/strings.json
 *        - real:  produced by Lingo from the EN catalog (committed)
 *        - --stub: synthesized in-memory ("[fr] " + en) for offline validation
 *   4. re-inject FR prose into the spec -> ./.openapi-docs.fr.yaml
 *   5. clean              -> rm src/content/fr/api/endpoint (unless --no-clean)
 *   6. docs-md (V2)       -> src/content/fr/api/**
 *   7. post-process MDX   -> src/content/fr/api/**
 *
 * The EN tree is never touched. V1/SDK-tab merge is intentionally out of scope
 * for this spike (orthogonal to translation).
 *
 * Flags:
 *   --translate     Produce the FR catalog locally via the Mistral API
 *                   (runs translate-catalog.ts) instead of expecting Lingo's.
 *   --stub          Don't require a translated FR catalog; synthesize one by
 *                   prefixing each EN string with "[fr] " (proves the
 *                   generation/rendering pipeline without an MT pass).
 *   --skip-apply    Reuse the existing ./.openapi-docs.yaml.
 *   --no-clean      Keep the existing src/content/fr/api/endpoint tree. By default
 *                   it's purged first (docs-md never prunes stale pages). The FR
 *                   catalog under _i18n/ is always preserved.
 */

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import yaml from 'js-yaml';
import { reinjectStrings, type StringCatalog } from './lib/spec-strings';

const EN_SPEC = './.openapi-docs.yaml';
const FR_SPEC = './.openapi-docs.fr.yaml';
const EN_CATALOG = './src/content/en/api/_i18n/strings.json';
const FR_CATALOG = './src/content/fr/api/_i18n/strings.json';
const FR_PAGE_OUT_DIR = './src/content/fr/api';
const FR_SIDEBAR_META = './src/content/fr/api/sidebar-metadata.json';
const FR_MDX_GLOB = './src/content/fr/api/**/*.mdx';

type CliFlags = { stub: boolean; translate: boolean; skipApply: boolean; clean: boolean };

function parseArgs(argv: string[]): CliFlags {
  const flags: CliFlags = { stub: false, translate: false, skipApply: false, clean: true };
  for (const arg of argv) {
    if (arg === '--stub') flags.stub = true;
    else if (arg === '--translate') flags.translate = true;
    else if (arg === '--skip-apply') flags.skipApply = true;
    else if (arg === '--no-clean') flags.clean = false;
    else if (arg === '--help' || arg === '-h') {
      console.log(
        'Usage: tsx src/scripts/api/build-fr.ts [--translate] [--stub] [--skip-apply] [--no-clean]'
      );
      process.exit(0);
    } else throw new Error(`Unknown flag: ${arg}`);
  }
  return flags;
}

function run(label: string, command: string, args: string[], env?: Record<string, string>) {
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

function loadCatalog(path: string): StringCatalog {
  return JSON.parse(readFileSync(path, 'utf8')) as StringCatalog;
}

// Purge only the generated endpoint/ tree — NOT _i18n/ (holds the FR catalog)
// nor sidebar-metadata.json. docs-md never prunes pages for tags removed/renamed
// upstream, so without this, stale FR pages would linger.
function clean(dir: string) {
  console.log('');
  console.log('▸ clean generated endpoint pages');
  console.log(`  $ rm -rf ${dir}`);
  rmSync(dir, { recursive: true, force: true });
}

function main() {
  const flags = parseArgs(process.argv.slice(2));

  if (!flags.skipApply) {
    run('apply patches', 'pnpm', ['exec', 'tsx', 'src/scripts/api/apply.ts']);
  }
  if (!existsSync(EN_SPEC)) {
    console.error(`Missing ${EN_SPEC}. Run \`pnpm api:apply\` first (or drop --skip-apply).`);
    process.exit(1);
  }

  run('extract strings', 'pnpm', ['exec', 'tsx', 'src/scripts/api/extract-spec-strings.ts']);

  // Resolve the FR catalog.
  let frCatalog: StringCatalog;
  if (flags.stub) {
    const en = loadCatalog(EN_CATALOG);
    frCatalog = {};
    for (const [pointer, value] of Object.entries(en)) frCatalog[pointer] = `[fr] ${value}`;
    console.log(`\n▸ stub FR catalog: ${Object.keys(frCatalog).length} strings prefixed with "[fr] "`);
  } else {
    if (flags.translate) {
      run('translate catalog (mistral)', 'pnpm', [
        'exec',
        'tsx',
        'src/scripts/api/translate-catalog.ts',
      ]);
    }
    if (!existsSync(FR_CATALOG)) {
      console.error(
        `Missing FR catalog ${FR_CATALOG}.\n` +
          `Produce it one of these ways:\n` +
          `  - pnpm api:build:fr --translate   (translate locally via Mistral API)\n` +
          `  - pnpm api:translate              (same, standalone)\n` +
          `  - commit ${EN_CATALOG} & let Lingo translate it\n` +
          `  - pnpm api:build:fr --stub        (offline "[fr] " validation)`
      );
      process.exit(1);
    }
    frCatalog = loadCatalog(FR_CATALOG);
  }

  // Re-inject FR prose into the spec and write the FR spec.
  const spec = yaml.load(readFileSync(EN_SPEC, 'utf8'));
  const injected = reinjectStrings(spec, frCatalog);
  writeFileSync(FR_SPEC, yaml.dump(spec, { lineWidth: -1, noRefs: true }));
  console.log(`\n▸ FR spec: re-injected ${injected} strings -> ${FR_SPEC}`);

  if (flags.clean) {
    clean(`${FR_PAGE_OUT_DIR}/endpoint`);
  }

  const docsEnv = {
    SPEAKEASY_OPENAPI_YAML: FR_SPEC,
    API_PAGE_OUT_DIR: FR_PAGE_OUT_DIR,
    API_SIDEBAR_META_PATH: FR_SIDEBAR_META,
  };
  run('docs-md (V2, fr)', 'pnpm', ['exec', 'docs-md'], docsEnv);
  run('post-process MDX (fr)', 'pnpm', ['exec', 'tsx', 'src/scripts/api/postprocess-mdx.ts'], {
    API_MDX_POSTPROCESS_GLOB: FR_MDX_GLOB,
  });

  // Localize the tag-name-derived labels (sidebar + page H1) that docs-md leaves
  // in English. Needs the Mistral API, so skip in offline --stub mode.
  if (!flags.stub) {
    run('localize labels (mistral)', 'pnpm', [
      'exec',
      'tsx',
      'src/scripts/api/localize-fr-labels.ts',
      '--locale',
      'fr',
    ]);
  }

  console.log('');
  console.log('✓ FR API docs build complete');
}

main();
