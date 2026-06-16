/**
 * Detect placeholder values in OpenAPI / generated MDX content.
 *
 * Three severity levels:
 *   - critical: definitely broken (Speakeasy fallback strings, format mismatch).
 *   - warning : schema constraint violated (out-of-range, pattern fail).
 *   - doubt   : heuristically suspect (generic strings, name/value mismatch).
 *
 * Speakeasy fallback strings are copied verbatim from
 *   node_modules/@speakeasy-api/docs-md/dist/data/generateCodeSamples.js
 *
 * If Speakeasy ships new strings, the regex safety net catches them and
 * prints a warning so we know to update the exact list.
 */

export type Severity = 'critical' | 'warning' | 'doubt';

export type DetectionReason =
  | 'lorem-exact'
  | 'lorem-safety'
  | 'format-mismatch'
  | 'enum-violation'
  | 'out-of-range'
  | 'pattern-mismatch'
  | 'generic-string'
  | 'shortness'
  | 'name-vs-value'
  | 'empty-required';

export type Detection = {
  severity: Severity;
  reason: DetectionReason;
  matched: string;
  hint?: string;
};

// ─── Speakeasy fallback strings (verbatim from generateCodeSamples.js) ────────

export const SPEAKEASY_FALLBACK_STRINGS = new Set<string>([
  'cillum culpa aute minim',
  'ipsum eiusmod',
  'consequat do',
  'reprehenderit ut dolore',
  'occaecat dolor sit',
  'nostrud',
  'aute aliqua aute commodo',
  'irure',
  'dolor',
  'sunt',
  'nisi minim commodo irure minim',
  'do do sint mollit',
  'occaecat',
  'fugiat',
  'non nisi proident Lorem',
  'nostrud anim',
  'exercitation aliqua sint',
  'ut sint',
  'dolor voluptate eu',
  'quis minim non magna quis',
  'et voluptate',
  'commodo labore aliqua ad',
  'elit culpa est non',
  'dolore aliqua eu',
  'proident',
  'anim eiusmod labore',
  'ullamco',
  'voluptate aliquip',
  'et excepteur dolore commodo id',
  'in consectetur excepteur sint',
  'sunt amet',
  'duis ea',
  'nisi laborum',
  'cupidatat nulla velit',
  'magna est commodo officia',
  'velit qui velit ullamco',
  'ad do deserunt exercitation',
  'quis deserunt anim',
  'velit laboris fugiat',
  'ad occaecat elit proident ea',
]);

export const SPEAKEASY_FALLBACK_DATE = '2025-10-07T20:56:01.974Z';

// ─── Safety-net regex (catches new Speakeasy strings before we update) ───────

const LOREM_SAFETY_RE =
  /\b(ipsum|consequat|reprehenderit|occaecat|nostrud|irure|cillum|eiusmod|aute|aliqua|cupidatat|excepteur|ullamco|voluptate|proident|laborum|esse|deserunt|exercitation|labore|fugiat)\b/i;

// ─── Format validators (basic shape checks; not full RFC compliance) ─────────

const FORMAT_VALIDATORS: Record<string, RegExp> = {
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  uri: /^https?:\/\//i,
  url: /^https?:\/\//i,
  email: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
  'date-time': /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
  date: /^\d{4}-\d{2}-\d{2}$/,
};

// ─── Doubt heuristics: generic strings & shortness ───────────────────────────

const GENERIC_PLACEHOLDERS = new Set([
  'string',
  '<string>',
  'value',
  '<value>',
  'example',
  'foo',
  'bar',
  'baz',
  'test',
]);

// ─── Doubt heuristics: property name vs value semantics ──────────────────────

type NameRule = {
  test: (name: string) => boolean;
  validate: (value: string) => boolean;
  hint: string;
};

const NAME_RULES: NameRule[] = [
  {
    test: n => /url|uri|link/i.test(n),
    validate: v => /^https?:\/\//i.test(v),
    hint: 'property name suggests URL but value is not URL-shaped',
  },
  {
    test: n => /email/i.test(n),
    validate: v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v),
    hint: 'property name suggests email but value is not email-shaped',
  },

  {
    test: n => /^model(_name)?$/i.test(n),
    validate: v => /^(mistral|codestral|pixtral|magistral|ministral|open-mistral|open-mixtral|voxtral)/i.test(v),
    hint: 'property name suggests a Mistral model but value does not match known names',
  },
  {
    test: n => /(token|api_?key|secret)/i.test(n) && !/cached_tokens|max_tokens|n_tokens|tokens$/i.test(n),
    validate: v => v.length >= 16,
    hint: 'property name suggests a credential but value is too short to be realistic',
  },
  {
    test: n => /(_at$|timestamp|created|updated|completed|started|modified)/i.test(n),
    validate: v => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(v) || /^\d{10,}$/.test(v),
    hint: 'property name suggests a timestamp but value is not date-shaped',
  },
];

// ─── Public API ──────────────────────────────────────────────────────────────

export type SchemaHint = {
  format?: string;
  enum?: unknown[];
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
  pattern?: string;
  required?: boolean;
};

/**
 * Inspect a single value in context (property name + schema hints).
 * Returns the most severe detection found, or `null` if clean.
 */
export function detectIssue(
  value: unknown,
  propertyName?: string,
  schema: SchemaHint = {}
): Detection | null {
  // ── String ────────────────────────────────────────────────────────────────
  if (typeof value === 'string') {
    // Critical: Speakeasy fallback (exact match)
    if (SPEAKEASY_FALLBACK_STRINGS.has(value)) {
      return {
        severity: 'critical',
        reason: 'lorem-exact',
        matched: value,
        hint: 'Speakeasy fallback string — provide example|default|enum',
      };
    }

    // Critical: lorem safety net (Speakeasy may have added new strings)
    const loremMatch = value.match(LOREM_SAFETY_RE);
    if (loremMatch) {
      return {
        severity: 'critical',
        reason: 'lorem-safety',
        matched: loremMatch[0],
        hint: 'looks like a new Speakeasy fallback — update SPEAKEASY_FALLBACK_STRINGS list',
      };
    }

    // Critical: format mismatch
    if (schema.format && FORMAT_VALIDATORS[schema.format]) {
      if (!FORMAT_VALIDATORS[schema.format].test(value)) {
        return {
          severity: 'critical',
          reason: 'format-mismatch',
          matched: value,
          hint: `expected format ${schema.format}`,
        };
      }
    }

    // Critical: enum violation
    if (Array.isArray(schema.enum) && !schema.enum.includes(value)) {
      return {
        severity: 'critical',
        reason: 'enum-violation',
        matched: value,
        hint: `expected one of: ${schema.enum.slice(0, 5).join(', ')}`,
      };
    }

    // Warning: pattern mismatch
    if (schema.pattern) {
      try {
        if (!new RegExp(schema.pattern).test(value)) {
          return {
            severity: 'warning',
            reason: 'pattern-mismatch',
            matched: value,
            hint: `expected pattern /${schema.pattern}/`,
          };
        }
      } catch {
        /* invalid regex in spec; ignore */
      }
    }

    // Doubt: generic placeholder
    if (GENERIC_PLACEHOLDERS.has(value.trim().toLowerCase())) {
      return {
        severity: 'doubt',
        reason: 'generic-string',
        matched: value,
        hint: 'value looks like a placeholder',
      };
    }

    // Doubt: shortness (likely accidental, but allow common short-code fields
    // such as language="en" and numeric indices rendered as strings)
    if (
      value.length > 0 &&
      value.length < 3 &&
      !Array.isArray(schema.enum) &&
      !/language|locale|index/i.test(propertyName ?? '')
    ) {
      return {
        severity: 'doubt',
        reason: 'shortness',
        matched: value,
        hint: 'value is suspiciously short',
      };
    }

    // Doubt: property name vs value
    if (propertyName) {
      for (const rule of NAME_RULES) {
        if (rule.test(propertyName) && !rule.validate(value)) {
          return {
            severity: 'doubt',
            reason: 'name-vs-value',
            matched: value,
            hint: rule.hint,
          };
        }
      }
    }

    return null;
  }

  // ── Number ────────────────────────────────────────────────────────────────
  if (typeof value === 'number') {
    // Warning: out of declared range
    if (schema.minimum !== undefined && value < schema.minimum) {
      return {
        severity: 'warning',
        reason: 'out-of-range',
        matched: String(value),
        hint: `below minimum ${schema.minimum}`,
      };
    }
    if (schema.maximum !== undefined && value > schema.maximum) {
      return {
        severity: 'warning',
        reason: 'out-of-range',
        matched: String(value),
        hint: `above maximum ${schema.maximum}`,
      };
    }
    if (schema.exclusiveMinimum !== undefined && value <= schema.exclusiveMinimum) {
      return {
        severity: 'warning',
        reason: 'out-of-range',
        matched: String(value),
        hint: `not strictly above ${schema.exclusiveMinimum}`,
      };
    }
    if (schema.exclusiveMaximum !== undefined && value >= schema.exclusiveMaximum) {
      return {
        severity: 'warning',
        reason: 'out-of-range',
        matched: String(value),
        hint: `not strictly below ${schema.exclusiveMaximum}`,
      };
    }

    // Numeric examples are best-effort: only flag them when they violate
    // declared schema constraints. Do not flag Speakeasy fallback-looking
    // numbers (23, 87, 14, ...); they may be acceptable in context.
    return null;
  }

  // ── Date string-shaped values handled above as strings via format validators
  // ── Booleans, arrays, objects, null: skip (handled by walker, not here)
  return null;
}

/**
 * Walk a value (typically a Request Example body) and yield all detections,
 * paired with the JSON path inside the value where they were found.
 *
 * Schema is walked in parallel (best-effort) so we can pass format/enum hints
 * down to detectIssue.
 */
export function* iterateDetections(
  value: unknown,
  schema: any,
  spec: any,
  path: string[] = []
): Generator<{ jsonPath: string[]; detection: Detection; propertyName?: string }> {
  // Resolve $ref once per visit
  const resolvedSchema = resolveRef(spec, schema);

  if (Array.isArray(value)) {
    const itemSchema = resolvedSchema?.items;
    for (let i = 0; i < value.length; i += 1) {
      yield* iterateDetections(value[i], itemSchema, spec, [...path, String(i)]);
    }
    return;
  }

  if (value && typeof value === 'object') {
    // oneOf/anyOf object variant: if possible, narrow by shape before reading properties.
    let objectSchema = resolvedSchema;
    if (objectSchema && typeof objectSchema === 'object' && (Array.isArray(objectSchema.oneOf) || Array.isArray(objectSchema.anyOf))) {
      const variants = (objectSchema.oneOf || objectSchema.anyOf)
        .map((s: any) => resolveRef(spec, s))
        .filter(Boolean);
      const keys = Object.keys(value as Record<string, unknown>);
      const matches = variants.filter((v: any) => {
        const props = v?.properties;
        return props && keys.every(k => k in props);
      });
      if (matches.length === 1) objectSchema = matches[0];
    }

    const props = objectSchema?.properties;
    const required: string[] = Array.isArray(objectSchema?.required)
      ? objectSchema.required
      : [];

    for (const [key, child] of Object.entries(value)) {
      const childSchema = props?.[key];
      // Empty-required check. Arrays like OCRPage.images are legitimately empty
      // in many examples, so only flag empty strings here.
      if (
        required.includes(key) &&
        child === ''
      ) {
        yield {
          jsonPath: [...path, key],
          propertyName: key,
          detection: {
            severity: 'doubt',
            reason: 'empty-required',
            matched: JSON.stringify(child),
            hint: 'required field is empty',
          },
        };
      }
      yield* iterateDetections(child, childSchema, spec, [...path, key]);
    }
    return;
  }

  // Scalar leaf: actually inspect. If this is an array item, use the parent
  // property name (e.g. execution_ids.0 -> execution_ids), not the numeric
  // index, so heuristics can pick the right default.
  const last = path[path.length - 1];
  const propertyName = /^\d+$/.test(last) ? path[path.length - 2] : last;
  const hint: SchemaHint = {};
  if (resolvedSchema && typeof resolvedSchema === 'object') {
    if (resolvedSchema.format) hint.format = resolvedSchema.format;
    if (Array.isArray(resolvedSchema.enum)) hint.enum = resolvedSchema.enum;
    if (resolvedSchema.minimum !== undefined) hint.minimum = resolvedSchema.minimum;
    if (resolvedSchema.maximum !== undefined) hint.maximum = resolvedSchema.maximum;
    if (resolvedSchema.exclusiveMinimum !== undefined)
      hint.exclusiveMinimum = resolvedSchema.exclusiveMinimum;
    if (resolvedSchema.exclusiveMaximum !== undefined)
      hint.exclusiveMaximum = resolvedSchema.exclusiveMaximum;
    if (resolvedSchema.pattern) hint.pattern = resolvedSchema.pattern;
  }

  const detection = detectIssue(value, propertyName, hint);
  if (detection) {
    yield { jsonPath: path, detection, propertyName };
  }
}

function resolveRef(spec: any, schema: any): any {
  if (!schema || typeof schema !== 'object') return schema;
  if (typeof schema.$ref !== 'string') return schema;
  if (!schema.$ref.startsWith('#/')) return schema;
  const segments = schema.$ref.slice(2).split('/');
  let current: any = spec;
  for (const segment of segments) {
    if (current == null) return undefined;
    current = current[segment];
  }
  return resolveRef(spec, current);
}
