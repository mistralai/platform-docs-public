import { DocsMetadata, SidebarItem } from '@/schema';
import { fullCookbooks, CookbookSaved } from '@/schema';

export function getCookbooksBreadcrumb(prevSlug: string[]): SidebarItem[] {
  return fullCookbooks.map(
    (cookbook: CookbookSaved) =>
      ({
        type: 'file' as const,
        metadata: {
          title: cookbook.title,
          sidebar_label: cookbook.title,
          description: '',
          hidePagination: true,
        } as DocsMetadata,
        toc: [],
        pagination: { prev: undefined, next: undefined },
        slug: [...prevSlug, cookbook.slug],
        clickable: true,
        isMarkdownFile: false,
      }) satisfies SidebarItem
  );
}
