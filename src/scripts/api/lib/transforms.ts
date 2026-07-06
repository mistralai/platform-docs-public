/**
 * Mechanical transforms applied to the OpenAPI spec before passing it to
 * docs-md. These are *not* configurable via the patch DB because they fix
 * structural incompatibilities, not content.
 *
 *   - hoistLocalDefs:   docs-md does not support $defs at the schema level;
 *                       we inline them into components/schemas with unique names.
 *   - pruneUnreferencedSchemas: removes schemas that are no longer referenced
 *                       after patches (keeps the generated reference page small).
 *   - applyTagOrder: keeps related API groups adjacent in docs navigation.
 *   - applyHeuristicExamples: fills a property `example` (from the shared
 *                       proposal-heuristics) wherever one is missing AND an
 *                       explicit name- or format-rule applies, so docs-md doesn't
 *                       fall back to lorem. Never overrides an existing/patched
 *                       example; type-guarded so a name-rule can't inject a
 *                       wrong-typed value; no generic fallback (uncovered fields
 *                       stay as-is for hand-curation or a new rule).
 */

import { loadHeuristics, proposePropertyExample } from './propose';

type JsonObject = Record<string, any>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function rewriteRefs(node: unknown, refMap: Map<string, string>) {
  if (Array.isArray(node)) {
    for (const item of node) rewriteRefs(item, refMap);
    return;
  }
  if (!isObject(node)) return;

  for (const [key, value] of Object.entries(node)) {
    if (key === '$ref' && typeof value === 'string' && refMap.has(value)) {
      node[key] = refMap.get(value);
      continue;
    }
    if (key === 'mapping' && isObject(value)) {
      for (const [k, v] of Object.entries(value)) {
        if (typeof v === 'string' && refMap.has(v)) value[k] = refMap.get(v);
      }
      continue;
    }
    rewriteRefs(value, refMap);
  }
}

export function hoistLocalDefs(spec: JsonObject): { hoisted: number } {
  const components = (spec.components ??= {});
  const schemas: JsonObject = (components.schemas ??= {});
  const planned = new Set<string>();
  let hoisted = 0;

  const uniqueName = (name: string): string => {
    if (!(name in schemas) && !planned.has(name)) {
      planned.add(name);
      return name;
    }
    let i = 1;
    let candidate = `Inline${name}${i}`;
    while (candidate in schemas || planned.has(candidate)) {
      i += 1;
      candidate = `Inline${name}${i}`;
    }
    planned.add(candidate);
    return candidate;
  };

  const visit = (node: unknown) => {
    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }
    if (!isObject(node)) return;

    const defs = node.$defs;
    if (isObject(defs)) {
      delete node.$defs;
      const refMap = new Map<string, string>();
      for (const name of Object.keys(defs)) {
        refMap.set(`#/$defs/${name}`, `#/components/schemas/${uniqueName(name)}`);
      }
      rewriteRefs(node, refMap);
      rewriteRefs(defs, refMap);
      for (const [name, schema] of Object.entries(defs)) {
        const target = refMap.get(`#/$defs/${name}`)?.split('/').at(-1);
        if (target) {
          schemas[target] = schema;
          hoisted += 1;
        }
      }
    }

    for (const value of Object.values(node)) visit(value);
  };

  visit(spec);
  return { hoisted };
}

/**
 * The dashboard spec ships the legacy Agents-completion and Fine-tuning
 * endpoints under the plain `agents` / `fine-tuning` tags, so docs-md emits them
 * at endpoint/agents and endpoint/fine-tuning. They are actually deprecated and
 * must live under endpoint/deprecated/** (the sidebar groups any slug containing
 * "deprecated" under the Deprecated category). Re-tag them by name (index-free,
 * so it survives the dashboard reordering or adding tags).
 */
const TAG_RENAMES: Record<string, { name: string; displayName: string }> = {
  agents: { name: 'deprecated.agents', displayName: 'Deprecated Agents' },
  'fine-tuning': { name: 'deprecated.fine-tuning', displayName: 'Deprecated Fine Tuning' },
};

export function applyTagRenames(spec: JsonObject): { renamed: number } {
  let renamed = 0;

  const paths = spec.paths;
  if (isObject(paths)) {
    for (const methods of Object.values(paths)) {
      if (!isObject(methods)) continue;
      for (const op of Object.values(methods)) {
        if (!isObject(op) || !Array.isArray(op.tags)) continue;
        op.tags = op.tags.map(tag => {
          const rename = typeof tag === 'string' ? TAG_RENAMES[tag] : undefined;
          if (rename) {
            renamed += 1;
            return rename.name;
          }
          return tag;
        });
      }
    }
  }

  if (Array.isArray(spec.tags)) {
    for (const tag of spec.tags) {
      if (!isObject(tag) || typeof tag.name !== 'string') continue;
      const rename = TAG_RENAMES[tag.name];
      if (rename) {
        tag.name = rename.name;
        tag['x-displayName'] = rename.displayName;
      }
    }
  }

  return { renamed };
}

const TAG_ADJACENCY_RULES: Array<{ after: string; names: string[] }> = [
  { after: 'beta.prompts', names: ['beta.skills'] },
];

export function applyTagOrder(spec: JsonObject): { moved: number } {
  if (!Array.isArray(spec.tags)) return { moved: 0 };

  let moved = 0;
  for (const rule of TAG_ADJACENCY_RULES) {
    const anchorIndex = spec.tags.findIndex(
      (tag: unknown) => isObject(tag) && tag.name === rule.after
    );
    if (anchorIndex === -1) continue;

    const moving: JsonObject[] = [];
    spec.tags = spec.tags.filter((tag: unknown) => {
      if (!isObject(tag) || !rule.names.includes(tag.name)) return true;
      moving.push(tag);
      return false;
    });

    if (moving.length === 0) continue;

    const nextAnchorIndex = spec.tags.findIndex(
      (tag: unknown) => isObject(tag) && tag.name === rule.after
    );
    spec.tags.splice(nextAnchorIndex + 1, 0, ...moving);
    moved += moving.length;
  }

  return { moved };
}

function collectSchemaRefs(node: unknown, refs: Set<string>) {
  if (Array.isArray(node)) {
    for (const item of node) collectSchemaRefs(item, refs);
    return;
  }
  if (!isObject(node)) return;

  const ref = node.$ref;
  if (typeof ref === 'string' && ref.startsWith('#/components/schemas/')) {
    refs.add(ref.split('/').pop()!);
  }
  const mapping = node.mapping;
  if (isObject(mapping)) {
    for (const v of Object.values(mapping)) {
      if (typeof v === 'string' && v.startsWith('#/components/schemas/')) {
        refs.add(v.split('/').pop()!);
      }
    }
  }
  for (const value of Object.values(node)) collectSchemaRefs(value, refs);
}

export function pruneUnreferencedSchemas(spec: JsonObject): { pruned: number } {
  const schemas = spec.components?.schemas;
  if (!isObject(schemas)) return { pruned: 0 };

  const referenced = new Set<string>();
  const entryComponents = { ...spec.components, schemas: undefined };
  const entrypoints = { ...spec, components: entryComponents };
  collectSchemaRefs(entrypoints, referenced);

  const queue = [...referenced];
  for (const name of queue) {
    const schema = schemas[name];
    if (!schema) continue;
    const before = referenced.size;
    collectSchemaRefs(schema, referenced);
    if (referenced.size > before) queue.push(...[...referenced].slice(before));
  }

  let pruned = 0;
  for (const name of Object.keys(schemas)) {
    if (!referenced.has(name)) {
      delete schemas[name];
      pruned += 1;
    }
  }
  return { pruned };
}

function scalarTypeSet(schema: JsonObject): Set<string> {
  const out = new Set<string>();
  const add = (t: unknown) => {
    if (typeof t === 'string') out.add(t);
    else if (Array.isArray(t)) for (const x of t) if (typeof x === 'string') out.add(x);
  };
  add(schema.type);
  for (const key of ['anyOf', 'oneOf'] as const) {
    if (Array.isArray(schema[key])) for (const v of schema[key]) if (isObject(v)) add(v.type);
  }
  return out;
}

function valueMatchesTypes(value: unknown, types: Set<string>): boolean {
  if (types.size === 0) return true; // unknown / composed-without-type → allow
  if (typeof value === 'string') return types.has('string');
  if (typeof value === 'number') return types.has('number') || types.has('integer');
  if (typeof value === 'boolean') return types.has('boolean');
  return true;
}

/**
 * Fill missing property `example`s from the heuristic proposer so docs-md doesn't
 * render lorem. Only acts where an explicit name/format rule applies (no generic
 * fallback), never overrides an existing example, and type-checks the proposed
 * value against the schema (the proposer applies *ByName rules before checking
 * type, so e.g. a `created_at` integer variant must not get the date-time string).
 * Run after patches so curated examples always win.
 */
export function applyHeuristicExamples(spec: JsonObject): { filled: number } {
  const defaults = loadHeuristics();
  let filled = 0;

  const hasFormatRule = (schema: JsonObject): boolean =>
    typeof schema.format === 'string' && defaults.stringByFormat?.[schema.format] !== undefined;

  const confident = (name: string, schema: JsonObject): boolean => {
    if (defaults.stringByName?.[name] !== undefined) return true; // covers scalars + arrays-by-name
    if (defaults.numberByName?.[name] !== undefined) return true;
    if (defaults.booleanByName?.[name] !== undefined) return true;
    if (hasFormatRule(schema)) return true;
    if (isObject(schema.items) && hasFormatRule(schema.items)) return true; // array items by format
    return false;
  };

  const fill = (name: string, propSchema: JsonObject): void => {
    if (typeof propSchema.$ref === 'string') return; // $ref target filled when walked
    if (!confident(name, propSchema)) return;
    const value = proposePropertyExample(spec, name, propSchema, defaults);
    if (value === undefined) return;

    // Array of scalar: the proposer returns the *items* value → set items.example.
    if (scalarTypeSet(propSchema).has('array') || isObject(propSchema.items)) {
      const items = propSchema.items;
      if (!isObject(items) || typeof items.$ref === 'string') return;
      if (items.example !== undefined || items.examples !== undefined) return;
      if (!valueMatchesTypes(value, scalarTypeSet(items))) return;
      items.example = value;
      filled += 1;
      return;
    }

    if (propSchema.example !== undefined || propSchema.examples !== undefined) return;
    if (!valueMatchesTypes(value, scalarTypeSet(propSchema))) return;
    propSchema.example = value;
    filled += 1;
  };

  const SKIP = new Set(['example', 'examples', 'default', 'const', 'enum']);
  const visit = (node: unknown): void => {
    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }
    if (!isObject(node)) return;
    if (isObject(node.properties)) {
      for (const [name, propSchema] of Object.entries(node.properties)) {
        if (isObject(propSchema)) fill(name, propSchema);
      }
    }
    for (const [key, value] of Object.entries(node)) {
      if (SKIP.has(key)) continue;
      visit(value);
    }
  };

  visit(spec);
  return { filled };
}
