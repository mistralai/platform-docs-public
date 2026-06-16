/**
 * Heuristic example generator.
 *
 * Given an OpenAPI schema (possibly containing $refs into the same spec),
 * produce a JSON value that looks plausible enough to be reviewed by a
 * human. The output is meant to seed `api-examples.draft.yaml`, not to be
 * used as-is in production docs.
 */

import { readFileSync } from 'node:fs';
import yaml from 'js-yaml';

type JsonObject = Record<string, any>;

export type ExampleDefaults = {
  stringByFormat?: Record<string, string>;
  stringByName?: Record<string, string>;
  numberByName?: Record<string, number>;
  booleanByName?: Record<string, boolean>;
};

const DEFAULT_HEURISTICS_FILE = './src/scripts/api/lib/proposal-heuristics.yaml';

let cachedHeuristics: ExampleDefaults | null = null;

export function loadHeuristics(filePath = DEFAULT_HEURISTICS_FILE): ExampleDefaults {
  if (cachedHeuristics) return cachedHeuristics;
  cachedHeuristics = yaml.load(readFileSync(filePath, 'utf8')) as ExampleDefaults;
  return cachedHeuristics;
}

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function resolveRef(spec: JsonObject, ref: string): JsonObject | undefined {
  if (!ref.startsWith('#/')) return undefined;
  const segments = ref.slice(2).split('/');
  let current: any = spec;
  for (const segment of segments) {
    if (current == null) return undefined;
    current = current[segment];
  }
  return isObject(current) ? current : undefined;
}

function pickFromComposed(
  composed: any[],
  spec: JsonObject,
  visited: Set<string>
): JsonObject | undefined {
  for (const candidate of composed) {
    if (!isObject(candidate)) continue;
    if (candidate.type === 'null') continue;
    return candidate;
  }
  return undefined;
}

function inferScalar(
  schema: JsonObject,
  propertyName: string | undefined,
  defaults: ExampleDefaults
): unknown {
  // Honor explicit example/default first
  if (schema.example !== undefined) return schema.example;
  if (Array.isArray(schema.examples) && schema.examples.length > 0) return schema.examples[0];
  if (schema.default !== undefined) return schema.default;
  if (Array.isArray(schema.enum) && schema.enum.length > 0) return schema.enum[0];
  if (schema.const !== undefined) return schema.const;

  const types = collectTypes(schema);

  if (propertyName) {
    if (defaults.stringByName?.[propertyName] !== undefined && types.has('string')) {
      return defaults.stringByName[propertyName];
    }
    if (
      (types.has('integer') || types.has('number')) &&
      defaults.numberByName?.[propertyName] !== undefined
    ) {
      return defaults.numberByName[propertyName];
    }
    if (types.has('boolean') && defaults.booleanByName?.[propertyName] !== undefined) {
      return defaults.booleanByName[propertyName];
    }
  }

  if (typeof schema.format === 'string' && defaults.stringByFormat?.[schema.format]) {
    return defaults.stringByFormat[schema.format];
  }

  if (types.has('string')) return defaults.stringByName?.value ?? 'example';
  if (types.has('integer') || types.has('number')) return 1;
  if (types.has('boolean')) return false;
  return null;
}

function collectTypes(schema: JsonObject): Set<string> {
  const types = new Set<string>();
  if (typeof schema.type === 'string') types.add(schema.type);
  if (Array.isArray(schema.type)) {
    for (const t of schema.type) {
      if (typeof t === 'string') types.add(t);
    }
  }
  for (const key of ['anyOf', 'oneOf', 'allOf']) {
    const nested = schema[key];
    if (Array.isArray(nested)) {
      for (const child of nested) {
        if (isObject(child) && typeof child.type === 'string') types.add(child.type);
      }
    }
  }
  return types;
}

/**
 * Build an example value from an OpenAPI schema.
 *
 * @param schema       schema fragment (may contain $ref into spec)
 * @param spec         full OpenAPI spec (for $ref resolution)
 * @param propertyName name of the property this schema is for, if any
 * @param defaults     heuristic lookup tables
 * @param visited      $refs already visited (cycle guard)
 */
export function generateExample(
  schema: JsonObject,
  spec: JsonObject,
  propertyName?: string,
  defaults: ExampleDefaults = loadHeuristics(),
  visited: Set<string> = new Set()
): unknown {
  if (!isObject(schema)) return null;

  // Honor explicit example before recursing
  if (schema.example !== undefined) return schema.example;
  if (Array.isArray(schema.examples) && schema.examples.length > 0) return schema.examples[0];

  if (typeof schema.$ref === 'string') {
    if (visited.has(schema.$ref)) return null; // cycle
    const resolved = resolveRef(spec, schema.$ref);
    if (!resolved) return null;
    return generateExample(
      resolved,
      spec,
      propertyName,
      defaults,
      new Set([...visited, schema.$ref])
    );
  }

  for (const key of ['anyOf', 'oneOf']) {
    const nested = schema[key];
    if (Array.isArray(nested)) {
      const picked = pickFromComposed(nested, spec, visited);
      if (picked) return generateExample(picked, spec, propertyName, defaults, visited);
    }
  }

  if (Array.isArray(schema.allOf)) {
    const merged: JsonObject = { type: 'object', properties: {}, required: [] };
    for (const sub of schema.allOf) {
      if (!isObject(sub)) continue;
      const resolved =
        typeof sub.$ref === 'string' ? resolveRef(spec, sub.$ref) ?? {} : sub;
      Object.assign(merged.properties, resolved.properties ?? {});
      if (Array.isArray(resolved.required)) {
        merged.required.push(...resolved.required);
      }
    }
    return generateExample(merged, spec, propertyName, defaults, visited);
  }

  const types = collectTypes(schema);

  if (types.has('object') || schema.properties) {
    const out: JsonObject = {};
    const properties = (schema.properties ?? {}) as JsonObject;
    const required = new Set(Array.isArray(schema.required) ? schema.required : []);

    // Prefer required props; if none, take first 3 props for brevity
    const propNames = Object.keys(properties);
    const propsToInclude = propNames.filter(name => required.has(name));
    if (propsToInclude.length === 0) {
      propsToInclude.push(...propNames.slice(0, 3));
    }

    for (const name of propsToInclude) {
      const propSchema = properties[name];
      if (!isObject(propSchema)) continue;
      out[name] = generateExample(propSchema, spec, name, defaults, visited);
    }
    return out;
  }

  if (types.has('array')) {
    const items = isObject(schema.items) ? schema.items : { type: 'string' };
    const itemExample = generateExample(items, spec, propertyName, defaults, visited);
    return [itemExample];
  }

  return inferScalar(schema, propertyName, defaults);
}

/**
 * Convenience: generate a request body example for an operation, looking up
 * the JSON schema under requestBody.content["application/json"].schema.
 */
export function generateRequestBodyExample(
  spec: JsonObject,
  operation: JsonObject
): unknown {
  const schema =
    operation?.requestBody?.content?.['application/json']?.schema;
  if (!isObject(schema)) return undefined;
  return generateExample(schema, spec);
}

/**
 * Generate a single value for a property's example (not a whole object).
 *
 * Returns `undefined` if we should NOT propose an example for this property,
 * either because:
 *   - it is a nested object (its sub-properties are handled separately),
 *   - it is an array whose items are a $ref (the referenced schema is handled),
 *   - it is an enum (speakeasy already uses enum[0]).
 *
 * Returns `null` if a value couldn't be inferred but a placeholder is wanted
 * (caller can decide to surface this as a low-confidence proposal).
 */
export function proposePropertyExample(
  spec: JsonObject,
  propertyName: string,
  propertySchema: JsonObject,
  defaults: ExampleDefaults = loadHeuristics()
): unknown {
  // Already has an example anywhere visible
  if (propertySchema.example !== undefined || propertySchema.examples !== undefined) {
    return undefined;
  }
  // Enum: speakeasy renders enum[0] by default
  if (Array.isArray(propertySchema.enum)) return undefined;

  // Strong heuristic: if propertyName is in our dictionary, use it regardless
  // of schema complexity (anyOf with arrays, oneOf, etc.). This covers cases
  // like UserMessage.content where the schema is anyOf[string, array<chunks>]
  // but a plain string example is what we want.
  if (defaults.stringByName?.[propertyName] !== undefined) {
    return defaults.stringByName[propertyName];
  }
  if (defaults.numberByName?.[propertyName] !== undefined) {
    return defaults.numberByName[propertyName];
  }
  if (defaults.booleanByName?.[propertyName] !== undefined) {
    return defaults.booleanByName[propertyName];
  }

  const types = collectTypes(propertySchema);

  // Nested object: handled by its own properties
  if (isObject(propertySchema.properties) || types.has('object')) return undefined;

  // Array
  if (types.has('array')) {
    const items = propertySchema.items;
    if (!isObject(items)) return null;
    // Items is a $ref → referenced schema's properties handle it
    if (typeof items.$ref === 'string') return undefined;
    if (items.example !== undefined || items.examples !== undefined) return undefined;
    if (isObject(items.properties) || items.type === 'object') return undefined;
    // Array of scalar/format → propose a value for items.example
    return inferScalar(items, propertyName, defaults);
  }

  // anyOf/oneOf containing only one non-null variant: propose for that
  for (const key of ['anyOf', 'oneOf']) {
    const composed = propertySchema[key];
    if (Array.isArray(composed)) {
      const nonNull = composed.filter(s => isObject(s) && s.type !== 'null');
      if (nonNull.length === 0) return undefined;
      // If a string variant exists, prefer it (most useful for plain examples)
      const stringVariant = nonNull.find(s => isObject(s) && s.type === 'string');
      if (isObject(stringVariant)) {
        return inferScalar(stringVariant, propertyName, defaults);
      }
      // If any variant is an object/array/$ref, defer to the schema walker
      if (nonNull.some(s => 'properties' in s || s.type === 'object' || s.type === 'array' || '$ref' in s)) {
        return undefined;
      }
      // All scalar variants — pick the first
      return inferScalar(nonNull[0] as JsonObject, propertyName, defaults);
    }
  }

  return inferScalar(propertySchema, propertyName, defaults);
}
