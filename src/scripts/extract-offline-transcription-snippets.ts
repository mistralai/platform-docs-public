import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const SOURCE_DIR = path.join(
  ROOT,
  'src/content/en/docs/studio-api/audio/speech_to_text/offline_transcription'
);
const OUT_DIR = path.join(ROOT, 'tests/snippets/offline-transcription');

const MODEL_REPLACEMENTS: Record<string, string> = {
  'voxtral-mini-latest': 'voxtral-mini-latest',
};

type Snippet = {
  id: string;
  source: string;
  language: string;
  outputPath: string;
};

async function listMdxFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async entry => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return listMdxFiles(fullPath);
      if (entry.isFile() && entry.name.endsWith('.mdx')) return [fullPath];
      return [];
    })
  );
  return files.flat();
}

function slugify(value: string): string {
  return value
    .replace(/\/page\.mdx$|\/_page\.mdx$/, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function extensionFor(language: string): string | null {
  if (language === 'python' || language === 'py') return 'py';
  if (language === 'typescript' || language === 'ts') return 'ts';
  if (language === 'bash' || language === 'sh') return 'sh';
  return null;
}

function appendResultPrinter(language: string, code: string): string {
  if (/transcriptionResponse|transcription_response|response/.test(code) === false) {
    return code;
  }

  if ((language === 'python' || language === 'py') && !/print\(/.test(code)) {
    const variable = /transcription_response/.test(code)
      ? 'transcription_response'
      : 'response';
    return `${code.trimEnd()}\n\nprint(${variable})\n`;
  }

  if ((language === 'typescript' || language === 'ts') && !/console\.log\(/.test(code)) {
    const variable = /transcriptionResponse/.test(code)
      ? 'transcriptionResponse'
      : 'response';
    return `${code.trimEnd()}\n\nconsole.log(JSON.stringify(${variable}, null, 2));\n`;
  }

  return code;
}

function normalizeSnippet(language: string, code: string): string {
  let normalized = appendResultPrinter(language, code);
  for (const [from, to] of Object.entries(MODEL_REPLACEMENTS)) {
    normalized = normalized.split(from).join(to);
  }
  return normalized.trimEnd() + '\n';
}

function extractCodeBlocks(source: string): Array<{ language: string; code: string }> {
  const blocks: Array<{ language: string; code: string }> = [];
  const regex = /```(\w+)\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(source))) {
    const language = match[1].trim();
    const code = match[2];
    if (extensionFor(language)) blocks.push({ language, code });
  }
  return blocks;
}

function isRunnableCandidate(language: string, code: string): boolean {
  if (language === 'python' || language === 'py') {
    return /client\.audio\.transcriptions\.complete/.test(code);
  }
  if (language === 'typescript' || language === 'ts') {
    return /client\.audio\.transcriptions\.complete/.test(code);
  }
  if (language === 'bash' || language === 'sh') {
    return /\/v1\/audio\/transcriptions/.test(code);
  }
  return false;
}

async function main() {
  await fs.rm(OUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUT_DIR, { recursive: true });

  const snippets: Snippet[] = [];
  const files = await listMdxFiles(SOURCE_DIR);

  for (const filePath of files.sort()) {
    const relative = path.relative(SOURCE_DIR, filePath);
    const blocks = extractCodeBlocks(await fs.readFile(filePath, 'utf8'));
    let index = 0;
    for (const block of blocks) {
      if (!isRunnableCandidate(block.language, block.code)) continue;
      index += 1;
      const extension = extensionFor(block.language)!;
      const id = `${slugify(relative)}-${String(index).padStart(2, '0')}`;
      const outputPath = path.join(OUT_DIR, `${id}.${extension}`);
      await fs.writeFile(outputPath, normalizeSnippet(block.language, block.code), 'utf8');
      snippets.push({
        id,
        source: relative,
        language: block.language,
        outputPath: path.relative(ROOT, outputPath),
      });
    }
  }

  await fs.writeFile(
    path.join(OUT_DIR, 'manifest.json'),
    JSON.stringify({ generatedFrom: path.relative(ROOT, SOURCE_DIR), snippets }, null, 2) + '\n',
    'utf8'
  );

  await fs.writeFile(
    path.join(OUT_DIR, 'README.md'),
    `# Offline transcription snippets\n\nGenerated from \`${path.relative(ROOT, SOURCE_DIR)}\`.\n\n## Regenerate\n\n\`\`\`bash\npnpm snippets:offline-transcription\n\`\`\`\n\n## Local smoke test\n\nChecks that generated snippets use the current transcription model, print their result for manual inspection, and compile where possible.\n\n\`\`\`bash\npnpm test:offline-transcription-snippets\n\`\`\`\n\n## Manual API test\n\nRun a snippet group in a temporary sandbox. By default, the runner downloads the Obama sample as \`audio.mp3\` inside the sandbox and rewrites placeholder paths to that file. Pass \`--audio-file path/to/audio.mp3\` to use your own file instead.\n\n\`\`\`bash\nMISTRAL_API_KEY=... pnpm test:script passing-transcription-audio-url-tab-basic-tab --python\nMISTRAL_API_KEY=... pnpm test:script passing-transcription-audio-file-tab-basic-tab --python\nMISTRAL_API_KEY=... pnpm test:script passing-transcription-audio-file-tab-basic-tab --python --audio-file ./my-audio.mp3\nMISTRAL_API_KEY=... pnpm test:script passing-transcription-audio-url-tab-basic-tab --all\n\`\`\`\n\nYou can also run a manually added file directly without editing the manifest:\n\n\`\`\`bash\nMISTRAL_API_KEY=... pnpm test:script tests/snippets/offline-transcription/my-test.py\nMISTRAL_API_KEY=... pnpm test:script my-test.ts\nMISTRAL_API_KEY=... pnpm test:script my-test.sh\n\`\`\`\n`,
    'utf8'
  );

  console.log(`Wrote ${snippets.length} snippets to ${path.relative(ROOT, OUT_DIR)}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
