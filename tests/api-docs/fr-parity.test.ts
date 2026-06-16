/**
 * T3 — FR parity & translation integrity.
 * The FR rendition must mirror EN structurally (same operations, anchors, payload
 * field names) — translation must not drop or rename structure — while the prose
 * is actually translated and the labels/headings localized.
 */

import { readFileSync } from 'node:fs';
import glob from 'fast-glob';
import { describe, expect, it } from 'vitest';
import { loadRendition, readPage, requestProps, successResponseProps } from './lib/rendition';

const en = loadRendition('en');
const fr = loadRendition('fr');
const H1_RE = /^# (.+?)[ \t]*$/m;

describe('FR/EN structural parity', () => {
  it('same slug set', () => {
    expect([...fr.slugs].sort()).toEqual([...en.slugs].sort());
  });

  it('same operation set', () => {
    expect([...fr.byOperationId.keys()].sort()).toEqual([...en.byOperationId.keys()].sort());
  });

  describe.each([...en.byOperationId.keys()].map(id => [id] as const))('%s', id => {
    it('same elementId + payload field names as EN', () => {
      const e = en.byOperationId.get(id)!;
      const f = fr.byOperationId.get(id);
      expect(f, `operation ${id} missing in FR`).toBeTruthy();
      expect(f!.op.elementId).toBe(e.op.elementId);
      expect(requestProps(f!.op).sort()).toEqual(requestProps(e.op).sort());
      expect(successResponseProps(f!.op).sort()).toEqual(successResponseProps(e.op).sort());
    });
  });
});

describe('FR translation integrity', () => {
  it('no [fr] stub remnants in FR pages', async () => {
    const files = await glob('./src/content/fr/api/**/*.mdx');
    const offenders = files.filter(f => readFileSync(f, 'utf8').includes('[fr] '));
    expect(offenders, `stub remnants in: ${offenders.join(', ')}`).toEqual([]);
  });

  it('FR and EN string catalogs have identical pointer sets', () => {
    const enCat = JSON.parse(readFileSync('./src/content/en/api/_i18n/strings.json', 'utf8'));
    const frCat = JSON.parse(readFileSync('./src/content/fr/api/_i18n/strings.json', 'utf8'));
    expect(Object.keys(frCat).sort()).toEqual(Object.keys(enCat).sort());
  });

  it('most catalog strings are actually translated (differ from EN)', () => {
    const enCat = JSON.parse(readFileSync('./src/content/en/api/_i18n/strings.json', 'utf8')) as Record<
      string,
      string
    >;
    const frCat = JSON.parse(readFileSync('./src/content/fr/api/_i18n/strings.json', 'utf8')) as Record<
      string,
      string
    >;
    const keys = Object.keys(enCat);
    const differing = keys.filter(k => frCat[k] !== enCat[k]);
    // Acronyms/brand names legitimately stay identical (~1.5% currently), so the
    // vast majority must differ. 0.9 catches a real translation regression while
    // tolerating untranslatable strings; the bare >0.5 floor was far too loose.
    expect(differing.length / keys.length).toBeGreaterThan(0.9);
  });

  it('each FR page H1 matches its (translated) sidebar label', () => {
    const mismatches: string[] = [];
    for (const entry of fr.sidebar) {
      const page = readPage('fr', entry.slug);
      if (!page) continue;
      const h1 = page.match(H1_RE)?.[1];
      if (h1 !== entry.sidebarLabel) mismatches.push(`${entry.slug}: H1="${h1}" label="${entry.sidebarLabel}"`);
    }
    expect(mismatches, `H1/label mismatches:\n${mismatches.join('\n')}`).toEqual([]);
  });
});
