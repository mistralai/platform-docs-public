import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const SNIPPET_DIR = path.join(ROOT, 'tests/snippets/offline-transcription');
const DEFAULT_NAME = 'passing-transcription-audio-url-tab-basic-tab';

type Manifest = {
  snippets: Array<{ id: string; language: string; outputPath: string }>;
};

type Mode = 'all' | 'python' | 'typescript' | 'curl';

type RunnerOptions = {
  name: string;
  mode: Mode;
  audioFile?: string;
};

function parseArgs(argv: string[]): RunnerOptions {
  let name = DEFAULT_NAME;
  let mode: Mode = 'all';
  let audioFile: string | undefined;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]!;
    if (arg === '--all') mode = 'all';
    else if (arg === '--python') mode = 'python';
    else if (arg === '--typescript' || arg === '--ts') mode = 'typescript';
    else if (arg === '--curl' || arg === '--bash') mode = 'curl';
    else if (arg === '--audio-file') {
      audioFile = argv[i + 1];
      i += 1;
    } else if (arg.startsWith('--audio-file=')) {
      audioFile = arg.slice('--audio-file='.length);
    } else name = arg;
  }

  return { name, mode, audioFile };
}

function run(command: string, args: string[], cwd: string, env = process.env) {
  console.log(`\n$ ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, {
    cwd,
    env,
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed with ${result.status}`);
  }
}

function modeMatches(language: string, mode: Mode) {
  if (mode === 'all') return true;
  const label = languageLabel(language);
  return label === mode;
}

type LanguageLabel = 'python' | 'typescript' | 'curl';

type RunnableSnippet = {
  id: string;
  language: LanguageLabel;
  outputPath: string;
};

function languageLabel(language: string): LanguageLabel | null {
  if (language === 'python' || language === 'py') return 'python';
  if (language === 'typescript' || language === 'ts') return 'typescript';
  if (language === 'bash' || language === 'sh') return 'curl';
  return null;
}

function languageFromFilePath(filePath: string): LanguageLabel | null {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === '.py') return 'python';
  if (extension === '.ts') return 'typescript';
  if (extension === '.sh') return 'curl';
  return null;
}

function resolveSnippetPath(input: string): string | null {
  const candidates = path.isAbsolute(input)
    ? [input]
    : [
        path.join(ROOT, input),
        path.join(SNIPPET_DIR, input),
      ];
  return candidates.find(candidate => existsSync(candidate)) ?? null;
}

async function resolveAudioFile(sandbox: string, requestedAudioFile?: string) {
  const target = path.join(sandbox, 'audio.mp3');
  if (requestedAudioFile) {
    const source = path.isAbsolute(requestedAudioFile)
      ? requestedAudioFile
      : path.join(ROOT, requestedAudioFile);
    if (!existsSync(source)) throw new Error(`Audio file not found: ${source}`);
    await fs.copyFile(source, target);
    return target;
  }

  console.log('Downloading default Obama audio sample as audio.mp3');
  run('curl', [
    '--silent',
    '--show-error',
    '--fail',
    '--location',
    'https://docs.mistral.ai/audio/obama.mp3',
    '--output',
    target,
  ], sandbox);
  return target;
}

function patchSnippetForAudioFile(content: string, audioFile: string) {
  return content
    .split('/path/to/file/audio.mp3').join(audioFile)
    .split('local_audio.mp3').join(audioFile)
    .split('music.mp3').join(audioFile)
    .split('examples/files/bcn_weather.mp3').join(audioFile)
    .split('<audio_base64>').join('REPLACED_BY_TEST_RUNNER');
}

async function extractFirstJsonObject(output: string): Promise<unknown> {
  const start = output.indexOf('{');
  if (start === -1) throw new Error(`Expected JSON object in output: ${output}`);
  return JSON.parse(output.slice(start));
}

async function createSignedUrl(sandbox: string, audioFile: string) {
  const upload = spawnSync('curl', [
    '--silent',
    '--show-error',
    '--fail',
    '--location',
    'https://api.mistral.ai/v1/files',
    '--header',
    `Authorization: Bearer ${process.env.MISTRAL_API_KEY}`,
    '--form',
    'purpose="audio"',
    '--form',
    `file=@${audioFile}`,
  ], { cwd: sandbox, encoding: 'utf8' });
  if (upload.status !== 0) {
    throw new Error(`Failed to upload audio file\n${upload.stdout}\n${upload.stderr}`);
  }

  const uploadJson = await extractFirstJsonObject(upload.stdout) as { id?: string };
  if (!uploadJson.id) throw new Error(`Upload response did not include file id: ${upload.stdout}`);

  const signed = spawnSync('curl', [
    '--silent',
    '--show-error',
    '--fail',
    '--location',
    `https://api.mistral.ai/v1/files/${uploadJson.id}/url?expiry=24`,
    '--header',
    'Accept: application/json',
    '--header',
    `Authorization: Bearer ${process.env.MISTRAL_API_KEY}`,
  ], { cwd: sandbox, encoding: 'utf8' });
  if (signed.status !== 0) {
    throw new Error(`Failed to get signed URL\n${signed.stdout}\n${signed.stderr}`);
  }

  const signedJson = await extractFirstJsonObject(signed.stdout) as { url?: string };
  if (!signedJson.url) throw new Error(`Signed URL response did not include url: ${signed.stdout}`);
  return signedJson.url;
}

async function copySnippet(snippetPath: string, sandbox: string, audioFile: string) {
  const target = path.join(sandbox, path.basename(snippetPath));
  let content = patchSnippetForAudioFile(await fs.readFile(snippetPath, 'utf8'), audioFile);
  if (content.includes('<signed_url>')) {
    const signedUrl = await createSignedUrl(sandbox, audioFile);
    content = content.split('<signed_url>').join(signedUrl);
  }
  await fs.writeFile(target, content, 'utf8');
  return target;
}

async function runPython(snippetPath: string, sandbox: string, audioFile: string) {
  const target = await copySnippet(snippetPath, sandbox, audioFile);
  const venv = path.join(sandbox, '.venv');
  run('python3', ['-m', 'venv', venv], sandbox);
  const python = path.join(venv, 'bin', 'python');
  run(python, ['-m', 'pip', 'install', '-q', 'mistralai'], sandbox);
  run(python, [target], sandbox);
}

async function runTypescript(snippetPath: string, sandbox: string, audioFile: string) {
  const target = await copySnippet(snippetPath, sandbox, audioFile);
  await fs.writeFile(
    path.join(sandbox, 'package.json'),
    JSON.stringify(
      {
        type: 'module',
        dependencies: {
          '@mistralai/mistralai': 'latest',
          tsx: 'latest',
          typescript: 'latest',
        },
      },
      null,
      2
    ) + '\n',
    'utf8'
  );
  run('npm', ['install', '--silent'], sandbox);
  run('npx', ['tsx', target], sandbox);
}

async function runCurl(snippetPath: string, sandbox: string, audioFile: string) {
  const target = await copySnippet(snippetPath, sandbox, audioFile);
  run('bash', [target], sandbox);
}

async function main() {
  const { name, mode, audioFile: requestedAudioFile } = parseArgs(process.argv.slice(2));
  const manifestPath = path.join(SNIPPET_DIR, 'manifest.json');

  if (!process.env.MISTRAL_API_KEY) {
    throw new Error('MISTRAL_API_KEY must be set in the environment.');
  }

  const directPath = resolveSnippetPath(name);
  let matching: RunnableSnippet[];

  if (directPath) {
    const language = languageFromFilePath(directPath);
    if (!language) {
      throw new Error(`Cannot infer language from ${name}. Use a .py, .ts, or .sh file.`);
    }
    if (mode !== 'all' && language !== mode) {
      throw new Error(`Direct snippet ${name} is ${language}, but mode ${mode} was requested.`);
    }
    matching = [
      {
        id: path.basename(directPath).replace(/\.[^.]+$/, ''),
        language,
        outputPath: path.relative(ROOT, directPath),
      },
    ];
  } else {
    if (!existsSync(manifestPath)) {
      throw new Error('Missing snippets manifest. Run `pnpm snippets:offline-transcription` first.');
    }

    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8')) as Manifest;
    matching = manifest.snippets.flatMap(snippet => {
      const language = languageLabel(snippet.language);
      if (!language || !snippet.id.startsWith(name) || !modeMatches(snippet.language, mode)) return [];
      return [{ id: snippet.id, language, outputPath: snippet.outputPath }];
    });

    if (matching.length === 0) {
      const available = manifest.snippets
        .map(snippet => snippet.id.replace(/-\d+$/, ''))
        .filter((value, index, array) => array.indexOf(value) === index)
        .sort();
      throw new Error(
        `No snippets found for ${name} with mode ${mode}. Available snippet groups:\n${available.join('\n')}`
      );
    }
  }

  const sandbox = await fs.mkdtemp(path.join(os.tmpdir(), `offline-transcription-${path.basename(name)}-`));
  console.log(`Sandbox: ${sandbox}`);
  const audioFile = await resolveAudioFile(sandbox, requestedAudioFile);
  console.log(`Audio file: ${audioFile}`);

  for (const snippet of matching) {
    await fs.mkdir(path.join(sandbox, snippet.id), { recursive: true });
    const snippetPath = path.isAbsolute(snippet.outputPath)
      ? snippet.outputPath
      : path.join(ROOT, snippet.outputPath);
    const label = snippet.language;
    console.log(`\n== ${snippet.id} (${label}) ==`);
    if (label === 'python') await runPython(snippetPath, path.join(sandbox, snippet.id), audioFile);
    if (label === 'typescript') await runTypescript(snippetPath, path.join(sandbox, snippet.id), audioFile);
    if (label === 'curl') await runCurl(snippetPath, path.join(sandbox, snippet.id), audioFile);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
