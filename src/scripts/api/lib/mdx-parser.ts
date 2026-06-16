/**
 * Extract Request Example AND Response Example blocks from generated docs-md
 * MDX pages.
 *
 * MDX shapes we look for:
 *   <OperationRequestBodyExamplesSection slot="request-body-examples">
 *     ### Request Example \{#operation-<operationId>_request-examples\}
 *     ```json ... ```
 *
 *   <OperationResponseBodyExamplesSection slot="response-body-examples">
 *     <ResponseExamplesTab id="operation-<operationId>_responses-examples_<status>_<media>">
 *     ```json ... ```
 *
 * For each MDX file we may find one or more such blocks (multi-examples).
 */

import { readFileSync } from 'node:fs';
import { relative } from 'node:path';
import glob from 'fast-glob';

export type ExampleKind = 'request' | 'response';

export type ParsedExample = {
  file: string;
  operationId: string;
  kind: ExampleKind;
  exampleName?: string;
  responseStatus?: string;
  rawJson: string;
  parsed: unknown;
};

const REQUEST_SECTION_RE = /<OperationRequestBodyExamplesSection[^>]*>([\s\S]*?)<\/OperationRequestBodyExamplesSection>/g;
const RESPONSE_SECTION_RE = /<OperationResponseBodyExamplesSection[^>]*>([\s\S]*?)<\/OperationResponseBodyExamplesSection>/g;

const REQUEST_HEADING_RE = /\{#operation-([a-zA-Z0-9_]+?)_request-examples(?:_([a-zA-Z0-9_-]+))?\\?\}/;
// e.g. operation-get_schedules_v1_workflows_schedules_get_responses-examples_200_application-json
const RESPONSE_TAB_RE = /id="operation-([a-zA-Z0-9_]+?)_responses-examples_([0-9]{3})_([a-zA-Z0-9_-]+)"/g;

const JSON_BLOCK_RE = /```json\s*\n([\s\S]*?)\n\s*```/g;

/**
 * Parse one MDX file. Returns one ParsedExample per Request Example block.
 * Failures (malformed JSON, missing operationId) are skipped silently with a
 * console warning so the audit doesn't crash on a single bad page.
 */
export function parseExamplesFromMdx(file: string): ParsedExample[] {
  const content = readFileSync(file, 'utf8');
  const out: ParsedExample[] = [];

  // ── Request examples ──────────────────────────────────────────────────────
  let reqMatch: RegExpExecArray | null;
  REQUEST_SECTION_RE.lastIndex = 0;
  while ((reqMatch = REQUEST_SECTION_RE.exec(content)) !== null) {
    const sectionBody = reqMatch[1];
    const headingMatch = REQUEST_HEADING_RE.exec(sectionBody);
    if (!headingMatch) continue;
    const operationId = headingMatch[1];
    const exampleName = headingMatch[2];

    JSON_BLOCK_RE.lastIndex = 0;
    let blockMatch: RegExpExecArray | null;
    while ((blockMatch = JSON_BLOCK_RE.exec(sectionBody)) !== null) {
      const rawJson = blockMatch[1].trim();
      try {
        out.push({
          file: relative(process.cwd(), file),
          operationId,
          kind: 'request',
          exampleName,
          rawJson,
          parsed: JSON.parse(rawJson),
        });
      } catch (error) {
        console.warn(
          `parseExamplesFromMdx: bad JSON in ${file} req:${operationId}: ${(error as Error).message}`
        );
      }
    }
  }

  // ── Response examples ─────────────────────────────────────────────────────
  // Each <OperationResponseBodyExamplesSection> may contain MULTIPLE response
  // tabs (one per status × media), each followed by its own JSON block. We
  // walk tabs by position and pair each with the next JSON block.
  let respMatch: RegExpExecArray | null;
  RESPONSE_SECTION_RE.lastIndex = 0;
  while ((respMatch = RESPONSE_SECTION_RE.exec(content)) !== null) {
    const sectionBody = respMatch[1];
    // Collect all (operationId, status, media) tuples in order
    const tabs: { operationId: string; status: string; media: string; index: number }[] = [];
    RESPONSE_TAB_RE.lastIndex = 0;
    let tabMatch: RegExpExecArray | null;
    while ((tabMatch = RESPONSE_TAB_RE.exec(sectionBody)) !== null) {
      tabs.push({
        operationId: tabMatch[1],
        status: tabMatch[2],
        media: tabMatch[3],
        index: tabMatch.index,
      });
    }
    // Collect all JSON blocks in order
    const blocks: { rawJson: string; index: number }[] = [];
    JSON_BLOCK_RE.lastIndex = 0;
    let bm: RegExpExecArray | null;
    while ((bm = JSON_BLOCK_RE.exec(sectionBody)) !== null) {
      blocks.push({ rawJson: bm[1].trim(), index: bm.index });
    }
    // Each tab is followed by a SectionContent → JSON block, but tabs come
    // first (they are the clickable buttons). We pair them by order.
    const tabBlockPairs = blocks.length === tabs.length
      ? tabs.map((tab, i) => ({ tab, block: blocks[i] }))
      : tabs.map((tab) => ({ tab, block: blocks.find(b => b.index > tab.index) }));

    for (const { tab, block } of tabBlockPairs) {
      if (!block) continue;
      try {
        out.push({
          file: relative(process.cwd(), file),
          operationId: tab.operationId,
          kind: 'response',
          responseStatus: tab.status,
          exampleName: `${tab.status}_${tab.media}`,
          rawJson: block.rawJson,
          parsed: JSON.parse(block.rawJson),
        });
      } catch (error) {
        console.warn(
          `parseExamplesFromMdx: bad JSON in ${file} resp:${tab.operationId}_${tab.status}: ${(error as Error).message}`
        );
      }
    }
  }

  return out;
}

export async function parseExamplesFromGlob(pattern: string): Promise<ParsedExample[]> {
  const files = await glob(pattern);
  const all: ParsedExample[] = [];
  for (const file of files) {
    all.push(...parseExamplesFromMdx(file));
  }
  return all;
}
