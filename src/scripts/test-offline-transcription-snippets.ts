import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const SNIPPET_DIR = path.join(ROOT, 'tests/snippets/offline-transcription');
const CURRENT_TRANSCRIPTION_MODEL = 'voxtral-mini-latest';
const STALE_TRANSCRIPTION_MODEL = 'voxtral-mini-2507';

type Manifest = {
  snippets: Array<{ id: string; language: string; outputPath: string }>;
};

function run(command: string, args: string[]) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: 'pipe',
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed\n${result.stdout}\n${result.stderr}`);
  }
}

async function main() {
  const manifestPath = path.join(SNIPPET_DIR, 'manifest.json');
  if (!existsSync(manifestPath)) {
    throw new Error('Missing manifest. Run `pnpm snippets:offline-transcription` first.');
  }

  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8')) as Manifest;
  if (manifest.snippets.length === 0) throw new Error('No snippets generated.');

  let staleHits = 0;
  let currentModelHits = 0;
  for (const snippet of manifest.snippets) {
    const filePath = path.join(ROOT, snippet.outputPath);
    const content = await fs.readFile(filePath, 'utf8');
    if (content.includes(STALE_TRANSCRIPTION_MODEL)) staleHits += 1;
    if (content.includes(CURRENT_TRANSCRIPTION_MODEL)) currentModelHits += 1;

    if (snippet.language === 'python' || snippet.language === 'py') {
      if (!/print\(/.test(content)) {
        throw new Error(`${snippet.outputPath} does not print its result.`);
      }
      run('python3', ['-m', 'py_compile', filePath]);
    }
    if (snippet.language === 'typescript' || snippet.language === 'ts') {
      if (!/console\.log\(/.test(content)) {
        throw new Error(`${snippet.outputPath} does not print its result.`);
      }
    }
    if (snippet.language === 'bash' || snippet.language === 'sh') {
      run('bash', ['-n', filePath]);
    }
  }

  if (staleHits > 0) {
    throw new Error(`Found ${staleHits} snippets with stale model ${STALE_TRANSCRIPTION_MODEL}.`);
  }
  if (currentModelHits === 0) {
    throw new Error(`No snippets mention ${CURRENT_TRANSCRIPTION_MODEL}.`);
  }

  console.log(`Offline transcription snippets OK: ${manifest.snippets.length} snippets, ${currentModelHits} use ${CURRENT_TRANSCRIPTION_MODEL}.`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
