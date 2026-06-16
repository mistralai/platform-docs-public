import { execFileSync } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';

const DEFAULT_REPO = 'mistralai/dashboard';
const DEFAULT_REF = 'main';
const DEFAULT_SPEC = 'openapi/specs/v2/openapi-public-doc.yaml';
const DEFAULT_OUT = 'openapi-public-doc.yaml';

type Args = {
  repo: string;
  ref: string;
  spec: string;
  out: string;
};

function parseArgs(argv: string[]): Args {
  const args: Args = {
    repo: DEFAULT_REPO,
    ref: DEFAULT_REF,
    spec: DEFAULT_SPEC,
    out: DEFAULT_OUT,
  };

  argv = argv.filter(arg => arg !== '--');

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === '--repo' && next) {
      args.repo = next;
      index += 1;
    } else if (arg === '--ref' && next) {
      args.ref = next;
      index += 1;
    } else if (arg === '--spec' && next) {
      args.spec = next;
      index += 1;
    } else if (arg === '--out' && next) {
      args.out = next;
      index += 1;
    } else {
      throw new Error(`Unknown or incomplete argument: ${arg}`);
    }
  }

  return args;
}

function getGitHubToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN;

  try {
    return execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim();
  } catch {
    return undefined;
  }
}

async function download(url: string, out: string) {
  const token = getGitHubToken();
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github.raw',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok || !response.body) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  await mkdir(dirname(out), { recursive: true });
  await finished(
    Readable.fromWeb(response.body as unknown as Parameters<typeof Readable.fromWeb>[0]).pipe(
      createWriteStream(out)
    )
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const encodedSpec = args.spec.split('/').map(encodeURIComponent).join('/');
  const url = `https://api.github.com/repos/${args.repo}/contents/${encodedSpec}?ref=${encodeURIComponent(args.ref)}`;

  await download(url, args.out);
  console.log(`Fetched ${url} -> ${args.out}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
