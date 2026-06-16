/**
 * Walk a JSON value and an OpenAPI schema in parallel, mapping a JSON path
 * inside the rendered example back to the source schema location where an
 * `example:` field would live.
 *
 * Example:
 *   given JSON path        ['messages', '0', 'content']
 *   in operation           chat_completion_v1_chat_completions_post
 *   with sibling value     { role: 'user', ... }   ← discriminator
 *   resolves to            #/components/schemas/UserMessage/properties/content
 *
 * Output is a JSON pointer that, when appended with `/example`, yields the
 * patch path used by the audit.
 *
 * Returns:
 *   { kind: 'resolved', schemaPointer, schemaName }
 *   { kind: 'ambiguous', candidates: [...] }   for unions without discriminator
 *   { kind: 'unresolvable', reason }            opaque, fallback to operation-level patch
 */

type JsonObject = Record<string, any>;

export type Resolution =
  | { kind: 'resolved'; schemaPointer: string; schemaName?: string }
  | { kind: 'ambiguous'; candidates: { schemaPointer: string; schemaName?: string }[] }
  | { kind: 'unresolvable'; reason: string };

function isObject(v: unknown): v is JsonObject {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function resolveRef(spec: JsonObject, ref: string): { value: any; pointer: string } | null {
  if (!ref.startsWith('#/')) return null;
  const segments = ref.slice(2).split('/');
  let current: any = spec;
  for (const segment of segments) {
    if (current == null || typeof current !== 'object') return null;
    current = current[segment];
  }
  return current === undefined ? null : { value: current, pointer: ref.slice(1) };
}

function escapePointer(segment: string): string {
  return segment.replace(/~/g, '~0').replace(/\//g, '~1');
}

function findOperationByOperationId(
  spec: JsonObject,
  operationId: string
): { path: string; method: string; operation: JsonObject } | undefined {
  const paths = spec.paths;
  if (!isObject(paths)) return undefined;
  for (const [path, item] of Object.entries(paths)) {
    if (!isObject(item)) continue;
    for (const [method, op] of Object.entries(item)) {
      if (isObject(op) && op.operationId === operationId) {
        return { path, method, operation: op };
      }
    }
  }
  return undefined;
}

/**
 * Pick the best variant from a oneOf/anyOf using the discriminator value
 * present in the JSON value (sibling of the path being walked).
 */
function pickDiscriminatedVariant(
  schema: JsonObject,
  value: any,
  spec: JsonObject
): { variantSchema: JsonObject; variantPointer: string } | null {
  if (!isObject(schema)) return null;
  const composed = schema.oneOf || schema.anyOf;
  if (!Array.isArray(composed)) return null;
  const discriminator = schema.discriminator;
  if (!isObject(discriminator) || !value || typeof value !== 'object') return null;

  const propName = discriminator.propertyName;
  const discriminatorValue = (value as JsonObject)[propName];
  if (typeof discriminatorValue !== 'string') return null;

  const mapping = discriminator.mapping;
  if (isObject(mapping)) {
    const ref = mapping[discriminatorValue];
    if (typeof ref === 'string' && ref.startsWith('#/')) {
      const resolved = resolveRef(spec, ref);
      if (resolved && isObject(resolved.value)) {
        return { variantSchema: resolved.value, variantPointer: resolved.pointer };
      }
    }
  }

  // Fallback: scan composed entries by their $ref shortname
  for (const entry of composed) {
    if (isObject(entry) && typeof entry.$ref === 'string') {
      const shortName = entry.$ref.split('/').pop();
      if (shortName?.toLowerCase().includes(discriminatorValue.toLowerCase())) {
        const resolved = resolveRef(spec, entry.$ref);
        if (resolved && isObject(resolved.value)) {
          return { variantSchema: resolved.value, variantPointer: resolved.pointer };
        }
      }
    }
  }

  return null;
}

/**
 * Resolve a JSON path inside an example down to the schema property where
 * its `example:` field belongs.
 *
 * @param spec        full OpenAPI spec
 * @param operationId target operation
 * @param jsonValue   the parsed example object (root of the JSON path)
 * @param jsonPath    path segments (strings for keys, numeric strings for arrays)
 * @param origin      'request' (default) | { kind: 'response', status, media }
 */
export function resolveSchemaPointer(
  spec: JsonObject,
  operationId: string,
  jsonValue: any,
  jsonPath: string[],
  origin: 'request' | { kind: 'response'; status: string; media: string } = 'request'
): Resolution {
  const op = findOperationByOperationId(spec, operationId);
  if (!op) {
    return { kind: 'unresolvable', reason: `operation ${operationId} not found in spec` };
  }

  let schema: any;
  let pointer = '';

  if (origin === 'request') {
    schema = op.operation?.requestBody?.content?.['application/json']?.schema;
    if (!schema) {
      return { kind: 'unresolvable', reason: 'no application/json request body schema' };
    }
    if (typeof schema.$ref === 'string') {
      const resolved = resolveRef(spec, schema.$ref);
      if (!resolved) return { kind: 'unresolvable', reason: `unresolvable $ref ${schema.$ref}` };
      schema = resolved.value;
      pointer = resolved.pointer;
    } else {
      pointer = `/paths/${escapePointer(op.path)}/${op.method}/requestBody/content/${escapePointer('application/json')}/schema`;
    }
  } else {
    // Response example: locate via responses[status].content[media].schema
    const media = origin.media.replace(/-/g, '/'); // 'application-json' -> 'application/json'
    schema = op.operation?.responses?.[origin.status]?.content?.[media]?.schema;
    if (!schema) {
      return {
        kind: 'unresolvable',
        reason: `no ${origin.status}.${media} response schema for ${operationId}`,
      };
    }
    if (typeof schema.$ref === 'string') {
      const resolved = resolveRef(spec, schema.$ref);
      if (!resolved) return { kind: 'unresolvable', reason: `unresolvable $ref ${schema.$ref}` };
      schema = resolved.value;
      pointer = resolved.pointer;
    } else {
      pointer = `/paths/${escapePointer(op.path)}/${op.method}/responses/${origin.status}/content/${escapePointer(media)}/schema`;
    }
  }

  let value: any = jsonValue;

  for (let i = 0; i < jsonPath.length; i += 1) {
    const segment = jsonPath[i];
    const parentValue = value;

    // Resolve $ref if we landed on one
    if (isObject(schema) && typeof schema.$ref === 'string') {
      const resolved = resolveRef(spec, schema.$ref);
      if (!resolved) return { kind: 'unresolvable', reason: `unresolvable $ref ${schema.$ref}` };
      schema = resolved.value;
      pointer = resolved.pointer;
    }

    // allOf: find the sub-schema that actually owns the next property,
    // and switch our pointer to it. This is critical for inheritance:
    // patches must be applied where the property is defined, not on the
    // composite schema (which has no `properties` of its own).
    if (isObject(schema) && Array.isArray(schema.allOf)) {
      const subs = schema.allOf
        .map((sub: any) => {
          if (isObject(sub) && typeof sub.$ref === 'string') {
            const r = resolveRef(spec, sub.$ref);
            if (r && isObject(r.value)) return { schema: r.value, pointer: r.pointer };
          }
          return isObject(sub) ? { schema: sub, pointer } : null;
        })
        .filter(Boolean) as { schema: JsonObject; pointer: string }[];

      const owner = subs.find(s => isObject(s.schema.properties) && segment in s.schema.properties);
      if (owner) {
        schema = owner.schema;
        pointer = owner.pointer;
      } else {
        // fall through (no sub-schema owns the segment) — let later code error
      }
    }

    // oneOf / anyOf : need to pick a variant
    if (isObject(schema) && (Array.isArray(schema.oneOf) || Array.isArray(schema.anyOf))) {
      const composed = schema.oneOf || schema.anyOf;

      // Strategy 1: discriminator (best when the JSON has the discriminator key)
      const picked = pickDiscriminatedVariant(schema, parentValue, spec);
      if (picked) {
        schema = picked.variantSchema;
        pointer = picked.variantPointer;
      } else {
        // Strategy 2: shape-based — match variant to the JSON value's shape
        const nonNull = composed.filter((s: any) => isObject(s) && s.type !== 'null');
        const valueIsArray = Array.isArray(parentValue);
        const valueIsObject = parentValue !== null && typeof parentValue === 'object' && !valueIsArray;

        // Resolve each variant once for inspection
        const resolvedVariants = nonNull.map((entry: any) => {
          if (isObject(entry) && typeof entry.$ref === 'string') {
            const r = resolveRef(spec, entry.$ref);
            if (r && isObject(r.value)) {
              return { schema: r.value, pointer: r.pointer, name: entry.$ref.split('/').pop() };
            }
          }
          return isObject(entry) ? { schema: entry, pointer, name: undefined } : null;
        }).filter(Boolean) as { schema: JsonObject; pointer: string; name?: string }[];

        let pickedByShape: typeof resolvedVariants[number] | null = null;

        if (valueIsArray) {
          // pick the first variant that is `type: array`
          pickedByShape = resolvedVariants.find(v => v.schema.type === 'array' || isObject(v.schema.items)) ?? null;
        } else if (valueIsObject) {
          // pick the variant whose `properties` contains the next segment
          const matching = resolvedVariants.filter(v => isObject(v.schema.properties) && segment in v.schema.properties);
          if (matching.length === 1) {
            pickedByShape = matching[0];
          } else if (matching.length > 1) {
            return {
              kind: 'ambiguous',
              candidates: matching.map(v => ({
                schemaPointer: `${v.pointer}/properties/${escapePointer(segment)}`,
                schemaName: v.name,
              })),
            };
          }
        } else {
          // scalar value: pick the variant matching its primitive type
          const valueType = typeof parentValue;
          const wanted = valueType === 'number' ? ['number', 'integer'] : [valueType];
          pickedByShape = resolvedVariants.find(v => {
            const t = v.schema.type;
            if (typeof t === 'string') return wanted.includes(t);
            if (Array.isArray(t)) return t.some(x => wanted.includes(x));
            return false;
          }) ?? null;
        }

        if (pickedByShape) {
          schema = pickedByShape.schema;
          pointer = pickedByShape.pointer;
        } else {
          return {
            kind: 'unresolvable',
            reason: `oneOf/anyOf could not be narrowed to a variant matching value shape (${
              valueIsArray ? 'array' : valueIsObject ? `object with key ${segment}` : typeof parentValue
            })`,
          };
        }
      }
    }

    // Now navigate the segment
    if (Array.isArray(parentValue)) {
      // segment is numeric; schema.items is the per-item schema
      if (!isObject(schema)) {
        return { kind: 'unresolvable', reason: `expected array schema at ${jsonPath.slice(0, i).join('/')}` };
      }
      schema = schema.items;
      // pointer doesn't change for array index — items is the schema, but
      // /items/example would set items.example, which is what we want
      pointer = `${pointer}/items`;
      value = parentValue[Number(segment)];
    } else if (isObject(parentValue)) {
      if (!isObject(schema) || !isObject(schema.properties)) {
        return { kind: 'unresolvable', reason: `expected object schema at ${jsonPath.slice(0, i).join('/')}` };
      }
      const propSchema = schema.properties[segment];
      if (!propSchema) {
        return { kind: 'unresolvable', reason: `property '${segment}' not in schema at ${jsonPath.slice(0, i).join('/')}` };
      }
      schema = propSchema;
      pointer = `${pointer}/properties/${escapePointer(segment)}`;
      value = parentValue[segment];
    } else {
      return {
        kind: 'unresolvable',
        reason: `expected container at ${jsonPath.slice(0, i).join('/')}, got ${typeof parentValue}`,
      };
    }
  }

  // After walking the JSON path, resolve final $ref if any so we land on a
  // concrete schema for the property.
  if (isObject(schema) && typeof schema.$ref === 'string') {
    const resolved = resolveRef(spec, schema.$ref);
    if (resolved) {
      pointer = resolved.pointer;
    }
  }

  // Extract schema name from pointer if it's under components/schemas
  let schemaName: string | undefined;
  const m = pointer.match(/^\/components\/schemas\/([^/]+)/);
  if (m) schemaName = m[1];

  return { kind: 'resolved', schemaPointer: pointer, schemaName };
}
