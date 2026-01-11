import { DocsCategoryMetadata, DocsMetadata } from '..';

export type SidebarItemBase = {
  /* The slug of the page, or the overrided slug if it has one */
  slug: string[];
  /* The slug of the page to navigate to if the page is not clickable */
  overridedSlug?: string[];
  /* If the page is hidden, it will not be displayed in the sidebar */
  hidden?: boolean;
  /* If the page is clickable (has a page.* or a _meta.md) */
  clickable: boolean;
  /* The pagination of the page, injected in content/index.ts */
  pagination: {
    prev?: {
      title: string;
      href: string;
    };
    next?: {
      title: string;
      href: string;
    };
  };
  /** If the page is a markdown file */
  isMarkdownFile: boolean;
};

/* The sidebar item, is basically an abstraction of DocsMetadata and DocsCategoryMetadata*/
export type SidebarItem = SidebarItemBase &
  (
    | {
        type: 'file';
        metadata: DocsMetadata | null;
        toc: TocItem[];
      }
    | {
        type: 'category';
        metadata: DocsCategoryMetadata | null;
        children?: SidebarItem[];
        hasPage?: boolean;
      }
  );

/* The table of contents of the page, injected in content/index.ts */
export type TocItem = {
  id: string;
  value: string;
  depth: number;
};
