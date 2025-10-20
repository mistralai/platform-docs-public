import { SideBarTreeNode } from '@/components/layout/sidebar';
import { SidebarItem } from '@/schema';
import { getHrefSlugs } from '../urls';

export function getBreadcrumb(sidebar: SidebarItem[], slug: string[]) {
  const breadcrumb: SidebarItem[] = [];
  let topCategory: SidebarItem | null = null;

  if (!slug || slug.length === 0) {
    return { breadcrumb, topCategory };
  }

  // Build breadcrumb trail by finding each level
  for (let i = 0; i < slug.length; i++) {
    const currentSlug = slug.slice(0, i + 1);
    const item = findItemBySlug(sidebar, currentSlug);

    if (item) {
      // First item is the top category
      if (i === 0) {
        topCategory = item;
      }

      // Add all items to breadcrumb including current page
      breadcrumb.push(item);
    }
  }

  return { breadcrumb, topCategory };
}

function findItemBySlug(
  items: SidebarItem[],
  targetSlug: string[],
  debug?: boolean
): SidebarItem | null;
function findItemBySlug(
  items: SideBarTreeNode[],
  targetSlug: string[],
  debug?: boolean
): SidebarItem | null;
function findItemBySlug(
  items: (SidebarItem | SideBarTreeNode)[],
  targetSlug: string[],
  debug = false
): SidebarItem | SideBarTreeNode | null {
  for (const item of items) {
    if ('slug' in item) {
      if (
        item.slug.length === targetSlug.length &&
        item.slug.every(
          (part: string, index: number) => part === targetSlug[index]
        )
      ) {
        return item;
      }

      if (item.type === 'category' && item.children) {
        const found = findItemBySlug(item.children, targetSlug, debug);
        if (found) return found;
      }
    }

    if ('href' in item) {
      const found =
        item.href && getHrefSlugs(item.href).join('/') === targetSlug.join('/');

      if (found) return item;
    }
  }

  return null;
}

export function getSlugOrOverridedSlug(item: SidebarItem): string | null {
  if (item.type === 'category') {
    if (item.hasPage) {
      return `/${item.slug.join('/')}`;
    }

    if (item.overridedSlug) {
      return `/${item.overridedSlug.join('/')}`;
    }

    return null;
  }

  return `/${item.slug.join('/')}`;
}

export { findItemBySlug };
