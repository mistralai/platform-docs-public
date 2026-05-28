import 'server-only';
import enSidebarMetadata from '@/content/en/api/sidebar-metadata.json';
import type { ApiSidebarMetadata } from '@/app/[locale]/(api)/schema/api-sidebar';
import { defaultLocale, type Locale } from '@/i18n/config';

const IDENTITY_KEYS = ['elementId', 'slug', 'name'] as const;

/**
 * Merge `overlay` into `base`, keyed by `base`'s shape.
 * - Keys absent from `base` are dropped (a stale translation can't leak removed items).
 * - Arrays of objects are paired by identity key (elementId/slug/name).
 * - Scalars from `overlay` win when their runtime type matches `base`'s.
 */
function mergeStructural<T>(base: T, overlay: unknown): T {
  if (base === null || typeof base !== 'object') {
    if (overlay === null || overlay === undefined) return base;
    return typeof overlay === typeof base ? (overlay as T) : base;
  }

  if (Array.isArray(base)) {
    if (!Array.isArray(overlay)) return base;
    const overlayByKey = new Map<string, unknown>();
    for (const item of overlay) {
      if (item && typeof item === 'object') {
        for (const key of IDENTITY_KEYS) {
          const v = (item as Record<string, unknown>)[key];
          if (typeof v === 'string') {
            overlayByKey.set(`${key}:${v}`, item);
            break;
          }
        }
      }
    }
    return base.map(entry => {
      if (entry && typeof entry === 'object') {
        for (const key of IDENTITY_KEYS) {
          const v = (entry as Record<string, unknown>)[key];
          if (typeof v === 'string') {
            const match = overlayByKey.get(`${key}:${v}`);
            if (match !== undefined) return mergeStructural(entry, match);
            break;
          }
        }
      }
      return entry;
    }) as T;
  }

  const out: Record<string, unknown> = {};
  for (const key of Object.keys(base)) {
    out[key] = mergeStructural(
      (base as Record<string, unknown>)[key],
      (overlay as Record<string, unknown> | null | undefined)?.[key]
    );
  }
  return out as T;
}

async function loadOverlay(locale: Locale): Promise<unknown | null> {
  try {
    const mod = await import(`@/content/${locale}/api/sidebar-metadata.json`);
    return mod.default;
  } catch {
    return null;
  }
}

export async function getApiSidebarMetadata(
  locale: Locale
): Promise<ApiSidebarMetadata> {
  if (locale === defaultLocale) return enSidebarMetadata;
  const overlay = await loadOverlay(locale);
  if (!overlay) return enSidebarMetadata;
  return mergeStructural(enSidebarMetadata, overlay);
}
