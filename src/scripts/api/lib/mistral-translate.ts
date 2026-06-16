/**
 * Shared local-translation engine (Mistral API) with a committed translation
 * memory. Used by `translate-catalog.ts` (spec prose) and `localize-fr-labels.ts`
 * (sidebar labels + page headings).
 *
 * The TM (`src/scripts/api/translation-memory.<locale>.json`) maps an ENGLISH
 * string -> translated string. It dedupes repeated strings and makes re-runs
 * incremental (only new strings hit the API). It is committed so CI/teammates
 * reuse it.
 *
 * Env: MISTRAL_API_KEY (required), API_TRANSLATE_MODEL (default mistral-large-latest).
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const LANG_NAMES: Record<string, string> = { fr: 'French' };
const API_URL = 'https://api.mistral.ai/v1/chat/completions';

export type TranslateKind = 'prose' | 'label';

export type TranslateOptions = {
  locale: string;
  kind?: TranslateKind;
  model?: string;
  batch?: number;
  concurrency?: number;
  force?: boolean;
  onProgress?: (done: number, total: number) => void;
};

export function tmPath(locale: string): string {
  return `./src/scripts/api/translation-memory.${locale}.json`;
}

export function loadTM(locale: string): Record<string, string> {
  const p = tmPath(locale);
  return existsSync(p) ? (JSON.parse(readFileSync(p, 'utf8')) as Record<string, string>) : {};
}

function saveTM(locale: string, tm: Record<string, string>): void {
  const sorted: Record<string, string> = {};
  for (const k of Object.keys(tm).sort()) sorted[k] = tm[k];
  const p = tmPath(locale);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, JSON.stringify(sorted, null, 2) + '\n');
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function systemPrompt(langName: string, kind: TranslateKind): string {
  const common = [
    `You receive a JSON object whose keys are opaque ids and whose values are English strings.`,
    `Return ONLY a JSON object with the SAME keys and the translated values. No commentary.`,
    `Keep code identifiers, field/parameter names, enum values, HTTP methods, JSON keys, and`,
    `placeholders such as {execution_id}, {id}, %s, $ref unchanged.`,
    `Keep product/brand names as-is: "Mistral AI", "La Plateforme", "Le Chat".`,
    `Keep acronyms as-is: API, OCR, FIM, URL, ID, JSON, SDK.`,
  ];
  if (kind === 'label') {
    return [
      `You are a professional technical translator localizing UI navigation labels and`,
      `section headings for API reference documentation into ${langName}.`,
      `Translate as a concise heading/label, NOT a full sentence. No trailing punctuation.`,
      ...common,
    ].join('\n');
  }
  return [
    `You are a professional technical translator for API reference documentation.`,
    `Translate each English value into ${langName}, using a precise, neutral technical register.`,
    ...common,
    `Preserve all Markdown structure (bold/italics, lists, line breaks, headings).`,
    `NEVER translate text inside backticks (\`like_this\`), code blocks, or URLs.`,
    `Keep links intact: translate the [label] but never the (url).`,
    `Preserve leading/trailing whitespace and newline characters of each value.`,
  ].join('\n');
}

class RetryableError extends Error {}

async function callMistral(
  apiKey: string,
  model: string,
  langName: string,
  kind: TranslateKind,
  payload: Record<string, string>
): Promise<Record<string, string>> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt(langName, kind) },
        { role: 'user', content: JSON.stringify(payload) },
      ],
    }),
  });

  if (!res.ok) {
    if (res.status === 429 || res.status >= 500) throw new RetryableError(`HTTP ${res.status}`);
    throw new Error(`Mistral API error ${res.status}: ${await res.text()}`);
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new RetryableError('empty completion');

  let parsed: Record<string, string>;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new RetryableError('non-JSON completion');
  }
  for (const key of Object.keys(payload)) {
    if (typeof parsed[key] !== 'string') throw new RetryableError(`missing key ${key}`);
  }
  return parsed;
}

async function translateBatch(
  apiKey: string,
  model: string,
  langName: string,
  kind: TranslateKind,
  batch: string[]
): Promise<string[]> {
  const payload: Record<string, string> = {};
  batch.forEach((s, i) => (payload[String(i)] = s));

  let lastErr: unknown;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const out = await callMistral(apiKey, model, langName, kind, payload);
      return batch.map((_, i) => out[String(i)]);
    } catch (err) {
      lastErr = err;
      if (!(err instanceof RetryableError)) throw err;
      await sleep(2 ** attempt * 600);
    }
  }
  throw new Error(`Batch failed after retries: ${String(lastErr)}`);
}

async function runPool<T>(items: T[], size: number, worker: (item: T) => Promise<void>) {
  let cursor = 0;
  const runners = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (cursor < items.length) await worker(items[cursor++]);
  });
  await Promise.all(runners);
}

/**
 * Translate `strings` into `opts.locale`, updating + persisting the TM.
 * Returns a complete English -> translated map for the requested strings.
 */
export async function translateStrings(
  strings: string[],
  opts: TranslateOptions
): Promise<Record<string, string>> {
  const langName = LANG_NAMES[opts.locale];
  if (!langName) throw new Error(`Unsupported locale "${opts.locale}". Add it to LANG_NAMES.`);

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) throw new Error('MISTRAL_API_KEY is not set.');

  const model = opts.model || process.env.API_TRANSLATE_MODEL || 'mistral-large-latest';
  const batchSize = opts.batch ?? 20;
  const concurrency = opts.concurrency ?? 5;
  const kind = opts.kind ?? 'prose';

  const tm = opts.force ? {} : loadTM(opts.locale);
  const unique = Array.from(new Set(strings.filter(s => typeof s === 'string' && s !== '')));
  const missing = unique.filter(s => typeof tm[s] !== 'string');

  if (missing.length > 0) {
    const batches: string[][] = [];
    for (let i = 0; i < missing.length; i += batchSize) batches.push(missing.slice(i, i + batchSize));

    let done = 0;
    await runPool(batches, concurrency, async batch => {
      const translated = await translateBatch(apiKey, model, langName, kind, batch);
      batch.forEach((src, i) => (tm[src] = translated[i]));
      done += batch.length;
      opts.onProgress?.(done, missing.length);
    });
    saveTM(opts.locale, tm);
  }

  const result: Record<string, string> = {};
  for (const s of unique) result[s] = tm[s] ?? s;
  return result;
}
