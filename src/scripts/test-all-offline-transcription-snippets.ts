import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const SNIPPET_DIR = path.join(ROOT, 'tests/snippets/offline-transcription');
const DEFAULT_AUDIO_URL = 'https://docs.mistral.ai/audio/obama.mp3';

type Manifest = {
  snippets: Array<{ id: string; language: string; outputPath: string }>;
};

type Result = {
  id: string;
  language: string;
  status: 'PASS' | 'FAIL';
  logPath: string;
};

function runCapture(command: string, args: string[], cwd: string) {
  return spawnSync(command, args, {
    cwd,
    env: process.env,
    encoding: 'utf8',
    stdio: 'pipe',
  });
}

function run(command: string, args: string[], cwd: string) {
  console.log(`\n$ ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, {
    cwd,
    env: process.env,
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed with ${result.status}`);
  }
}

async function resolveAudioFile(sandbox: string) {
  const target = path.join(sandbox, 'audio.mp3');
  if (existsSync(target)) return target;
  run('curl', ['--silent', '--show-error', '--fail', '--location', DEFAULT_AUDIO_URL, '--output', target], sandbox);
  return target;
}

async function extractFirstJsonObject(output: string): Promise<unknown> {
  const start = output.indexOf('{');
  if (start === -1) throw new Error(`Expected JSON object in output: ${output}`);
  return JSON.parse(output.slice(start));
}

async function createSignedUrl(sandbox: string, audioFile: string) {
  const upload = runCapture('curl', [
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
  ], sandbox);
  if (upload.status !== 0) {
    throw new Error(`Failed to upload audio file\n${upload.stdout}\n${upload.stderr}`);
  }

  const uploadJson = await extractFirstJsonObject(upload.stdout) as { id?: string };
  if (!uploadJson.id) throw new Error(`Upload response did not include file id: ${upload.stdout}`);

  const signed = runCapture('curl', [
    '--silent',
    '--show-error',
    '--fail',
    '--location',
    `https://api.mistral.ai/v1/files/${uploadJson.id}/url?expiry=24`,
    '--header',
    'Accept: application/json',
    '--header',
    `Authorization: Bearer ${process.env.MISTRAL_API_KEY}`,
  ], sandbox);
  if (signed.status !== 0) {
    throw new Error(`Failed to get signed URL\n${signed.stdout}\n${signed.stderr}`);
  }

  const signedJson = await extractFirstJsonObject(signed.stdout) as { url?: string };
  if (!signedJson.url) throw new Error(`Signed URL response did not include url: ${signed.stdout}`);
  return signedJson.url;
}

function patchSnippet(content: string, audioFile: string, signedUrl: string) {
  return content
    .split('/path/to/file/audio.mp3').join(audioFile)
    .split('local_audio.mp3').join(audioFile)
    .split('music.mp3').join(audioFile)
    .split('examples/files/bcn_weather.mp3').join(audioFile)
    .split('<audio_base64>').join('REPLACED_BY_TEST_RUNNER')
    .split('<signed_url>').join(signedUrl);
}

async function prepareSnippet(snippetPath: string, sandbox: string, audioFile: string, signedUrl: string) {
  const target = path.join(sandbox, path.basename(snippetPath));
  const content = patchSnippet(await fs.readFile(snippetPath, 'utf8'), audioFile, signedUrl);
  await fs.writeFile(target, content, 'utf8');
  return target;
}

function languageLabel(language: string) {
  if (language === 'python' || language === 'py') return 'python';
  if (language === 'typescript' || language === 'ts') return 'typescript';
  if (language === 'bash' || language === 'sh') return 'curl';
  return null;
}

async function runSnippet(snippet: Manifest['snippets'][number], sandbox: string, audioFile: string, signedUrl: string, logPath: string) {
  const snippetSandbox = path.join(sandbox, snippet.id);
  await fs.mkdir(snippetSandbox, { recursive: true });
  const snippetPath = path.join(ROOT, snippet.outputPath);
  const target = await prepareSnippet(snippetPath, snippetSandbox, audioFile, signedUrl);
  const label = languageLabel(snippet.language);

  const log = [`== ${snippet.id} (${label}) ==`];
  let result: ReturnType<typeof spawnSync>;

  if (label === 'python') {
    const venv = path.join(snippetSandbox, '.venv');
    run('python3', ['-m', 'venv', venv], snippetSandbox);
    const python = path.join(venv, 'bin', 'python');
    run(python, ['-m', 'pip', 'install', '-q', 'mistralai'], snippetSandbox);
    result = runCapture(python, [target], snippetSandbox);
  } else if (label === 'typescript') {
    await fs.writeFile(
      path.join(snippetSandbox, 'package.json'),
      JSON.stringify({
        type: 'module',
        dependencies: {
          '@mistralai/mistralai': 'latest',
          tsx: 'latest',
          typescript: 'latest',
        },
      }, null, 2) + '\n',
      'utf8'
    );
    run('npm', ['install', '--silent'], snippetSandbox);
    result = runCapture('npx', ['tsx', target], snippetSandbox);
  } else if (label === 'curl') {
    result = runCapture('bash', [target], snippetSandbox);
  } else {
    throw new Error(`Unsupported snippet language: ${snippet.language}`);
  }

  log.push(`exit=${result.status ?? 'null'}`);
  if (result.stdout) log.push('\n[stdout]\n' + result.stdout);
  if (result.stderr) log.push('\n[stderr]\n' + result.stderr);
  await fs.writeFile(logPath, log.join('\n') + '\n', 'utf8');

  if (result.status !== 0) {
    throw new Error(`${snippet.id} failed with ${result.status}. See ${logPath}`);
  }
}

async function main() {
  if (!process.env.MISTRAL_API_KEY) throw new Error('MISTRAL_API_KEY must be set in the environment.');

  const manifest = JSON.parse(await fs.readFile(path.join(SNIPPET_DIR, 'manifest.json'), 'utf8')) as Manifest;
  const sandbox = await fs.mkdtemp(path.join(os.tmpdir(), 'offline-transcription-all-'));
  const logDir = path.join(sandbox, 'logs');
  await fs.mkdir(logDir, { recursive: true });

  console.log(`Sandbox: ${sandbox}`);
  const audioFile = await resolveAudioFile(sandbox);
  const signedUrl = await createSignedUrl(sandbox, audioFile);
  console.log(`Audio file: ${audioFile}`);
  console.log('Signed URL: ready');

  const results: Result[] = [];
  for (const snippet of manifest.snippets) {
    const logPath = path.join(logDir, `${snippet.id}.log`);
    try {
      await runSnippet(snippet, sandbox, audioFile, signedUrl, logPath);
      results.push({ id: snippet.id, language: snippet.language, status: 'PASS', logPath });
      console.log(`PASS ${snippet.id}`);
    } catch (error) {
      results.push({ id: snippet.id, language: snippet.language, status: 'FAIL', logPath });
      console.log(`FAIL ${snippet.id}`);
      console.error(error);
    }
  }

  const failed = results.filter(result => result.status === 'FAIL');
  console.log('\nSummary');
  for (const result of results) {
    console.log(`${result.status}\t${result.id}\t${result.logPath}`);
  }
  console.log(`\nPassed: ${results.length - failed.length}/${results.length}`);
  console.log(`Logs: ${logDir}`);

  if (failed.length > 0) process.exit(1);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
