/**
 * Parse the applied OpenAPI spec (`.openapi-docs.yaml`) into an index used as the
 * test oracle: operations, their request/response top-level property names,
 * parameters, and the docs slug each operation should land on.
 */

import { existsSync, readFileSync } from 'node:fs';
import yaml from 'js-yaml';
import { getByPointer } from '@/scripts/api/lib/json-pointer';

export const SPEC_PATH = './.openapi-docs.yaml';
const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'] as const;

export type PayloadShape = {
  present: boolean;
  /** Top-level property names (after $ref/allOf resolution). */
  props: string[];
  /** Root schema is oneOf/anyOf → property set is a union of variants (relaxed checks). */
  polymorphic: boolean;
};

export type SpecOperation = {
  operationId: string;
  method: string;
  path: string;
  /** All tags on the operation (docs-md may group under any of them). */
  tags: string[];
  /** Candidate docs slugs (one per tag). The rendition must use one of these. */
  slugCandidates: string[];
  params: string[];
  request: PayloadShape;
  response: PayloadShape;
};

export type SpecIndex = {
  operations: SpecOperation[];
  byOperationId: Map<string, SpecOperation>;
};

/**
 * tag "a.b.c" -> slug "endpoint/a/b/c".
 *
 * This mirrors docs-md's *internal* tag→slug convention; there is no function in
 * our own source to import (transforms.ts only re-tags; the slug is produced by
 * docs-md). The oracle must encode this mapping independently anyway — importing
 * the code that produces the output would make the coverage check circular.
 */
export function tagToSlug(tag: string): string {
  return `endpoint/${tag.replace(/\./g, '/')}`;
}

let cached: SpecIndex | null = null;

export function loadSpecIndex(specPath = SPEC_PATH): SpecIndex {
  if (cached) return cached;
  if (!existsSync(specPath)) {
    throw new Error(
      `Spec not found at ${specPath}. Run \`pnpm api:apply\` first (or \`pnpm test:api\`, which does it).`
    );
  }
  const spec = yaml.load(readFileSync(specPath, 'utf8')) as any;

  const deref = (node: any): any => {
    let cur = node;
    let guard = 0;
    while (cur && typeof cur === 'object' && typeof cur.$ref === 'string' && guard < 20) {
      cur = getByPointer(spec, cur.$ref.replace(/^#/, ''));
      guard += 1;
    }
    return cur;
  };

  // Collect top-level property names through $ref / allOf / oneOf / anyOf.
  const collect = (schema: any, seen = new Set<any>()): { props: Set<string>; poly: boolean } => {
    const out = { props: new Set<string>(), poly: false };
    const s = deref(schema);
    if (!s || typeof s !== 'object' || seen.has(s)) return out;
    seen.add(s);

    if (s.properties && typeof s.properties === 'object') {
      for (const k of Object.keys(s.properties)) out.props.add(k);
    }
    for (const key of ['allOf', 'oneOf', 'anyOf'] as const) {
      if (Array.isArray(s[key])) {
        if (key !== 'allOf') out.poly = true;
        for (const sub of s[key]) {
          const r = collect(sub, seen);
          r.props.forEach(p => out.props.add(p));
          out.poly = out.poly || r.poly;
        }
      }
    }
    return out;
  };

  const jsonSchemaOf = (container: any): any => {
    const c = deref(container);
    return c?.content?.['application/json']?.schema ?? null;
  };

  const shapeOf = (schema: any): PayloadShape => {
    if (!schema) return { present: false, props: [], polymorphic: false };
    const { props, poly } = collect(schema);
    return { present: true, props: [...props].sort(), polymorphic: poly };
  };

  const successResponse = (responses: any): any => {
    if (!responses) return null;
    const code =
      Object.keys(responses).find(c => /^2\d\d$/.test(c)) ??
      (responses['default'] ? 'default' : null);
    return code ? jsonSchemaOf(responses[code]) : null;
  };

  const paramNames = (pathItem: any, op: any): string[] => {
    const all = [...(pathItem.parameters ?? []), ...(op.parameters ?? [])];
    const names = new Set<string>();
    for (const p of all) {
      const d = deref(p);
      if (d?.name) names.add(d.name as string);
    }
    return [...names].sort();
  };

  const operations: SpecOperation[] = [];
  for (const [path, pathItemRaw] of Object.entries<any>(spec.paths ?? {})) {
    const pathItem = deref(pathItemRaw);
    for (const method of HTTP_METHODS) {
      const op = pathItem?.[method];
      if (!op || typeof op !== 'object') continue;
      const tags = (op.tags ?? []) as string[];
      operations.push({
        operationId: op.operationId ?? `${method} ${path}`,
        method,
        path,
        tags,
        slugCandidates: tags.map(tagToSlug),
        params: paramNames(pathItem, op),
        request: shapeOf(jsonSchemaOf(op.requestBody)),
        response: shapeOf(successResponse(op.responses)),
      });
    }
  }

  cached = {
    operations,
    byOperationId: new Map(operations.map(o => [o.operationId, o])),
  };
  return cached;
}
