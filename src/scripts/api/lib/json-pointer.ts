/**
 * RFC 6901 JSON Pointer implementation (subset).
 *
 * Used to address any node in an OpenAPI spec via a single string,
 * e.g. `/paths/~1v1~1chat~1completions/post/requestBody/content/application~1json/example`.
 *
 * Encoding rules:
 *   - `~` -> `~0`
 *   - `/` -> `~1`
 */

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export function escapeSegment(segment: string): string {
  return segment.replace(/~/g, '~0').replace(/\//g, '~1');
}

export function unescapeSegment(segment: string): string {
  return segment.replace(/~1/g, '/').replace(/~0/g, '~');
}

export function parsePointer(pointer: string): string[] {
  if (pointer === '' || pointer === '/') return pointer === '/' ? [''] : [];
  if (!pointer.startsWith('/')) {
    throw new Error(`Invalid JSON pointer (must start with '/'): ${pointer}`);
  }
  return pointer.slice(1).split('/').map(unescapeSegment);
}

export function buildPointer(segments: string[]): string {
  if (segments.length === 0) return '';
  return '/' + segments.map(escapeSegment).join('/');
}

export function getByPointer(root: any, pointer: string): unknown {
  const segments = parsePointer(pointer);
  let current: any = root;
  for (const segment of segments) {
    if (current == null) return undefined;
    current = Array.isArray(current) ? current[Number(segment)] : current[segment];
  }
  return current;
}

export function setByPointer(root: any, pointer: string, value: unknown): void {
  const segments = parsePointer(pointer);
  if (segments.length === 0) {
    throw new Error('Cannot set root via JSON pointer');
  }

  let current: any = root;
  for (let i = 0; i < segments.length - 1; i += 1) {
    const segment = segments[i];
    const nextSegment = segments[i + 1];
    const isArrayIndex = /^\d+$/.test(nextSegment);

    if (Array.isArray(current)) {
      const index = Number(segment);
      if (current[index] == null) {
        current[index] = isArrayIndex ? [] : {};
      }
      current = current[index];
    } else {
      if (current[segment] == null) {
        current[segment] = isArrayIndex ? [] : {};
      }
      current = current[segment];
    }
  }

  const last = segments[segments.length - 1];
  if (Array.isArray(current)) {
    current[Number(last)] = value;
  } else {
    current[last] = value;
  }
}

export function existsByPointer(root: any, pointer: string): boolean {
  const segments = parsePointer(pointer);
  let current: any = root;
  for (const segment of segments) {
    if (current == null || typeof current !== 'object') return false;
    if (Array.isArray(current)) {
      const index = Number(segment);
      if (!(index in current)) return false;
      current = current[index];
    } else {
      if (!(segment in current)) return false;
      current = current[segment];
    }
  }
  return true;
}
