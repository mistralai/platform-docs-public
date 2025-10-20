import { DocsMetadata, getModelSlug, models, SidebarItem } from '@/schema';

export function getModelsBreadcrumb(prevSlug: string[]): SidebarItem[] {
  return models.map(
    model =>
      ({
        type: 'file' as const,
        metadata: {
          label: model.name,
          description: model.description,
          sidebar_position: 1,
          title: model.name,
          cta: model.playground
            ? {
                label: 'Try in playground ↗',
                href: model.playground,
              }
            : undefined,
          hidePagination: true,
        } as DocsMetadata,
        toc: [],
        pagination: { prev: undefined, next: undefined },
        slug: [...prevSlug, getModelSlug(model)],
        clickable: true,
      }) satisfies SidebarItem
  );
}
