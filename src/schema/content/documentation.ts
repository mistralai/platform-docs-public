export interface DocsMetadata {
  /* Used in the sidebar, Meta tags and Indexing */
  title: string;
  /* Used in Meta tags and Indexing */
  description: string;
  /* Used to position the item in the sidebar */
  sidebar_position: number;
  /* Used in the sidebar */
  sidebar_label?: string;
  /* This field is injected in content/index.ts */
  table_of_contents?: boolean;
  /* Used to override the breadcrumb label at right of the page */
  cta?: {
    label: string;
    href: string;
  };
  /* Used by indexing */
  suggest_rank?: number;
  /* Used in meta tags */
  tags?: string[];
  /* Used in meta tags */
  keywords?: string[];
  /* Used in meta tags */
  category?: string;
  /* If the page has no pagination, it will not be displayed in the sidebar */
  hidePagination?: boolean;
}

export interface DocsCategoryMetadata {
  /* Used in the sidebar */
  label: string;
  /* Used to position the item in the sidebar */
  position: number;
  /* Probably a category does not have a page.mdx or page.tsx, so we need to link to a doc */
  link?: string;
  /* Injected in content/index.ts */
  table_of_contents?: boolean;
  /* If the page has no pagination, it will not be displayed in the sidebar */
  hidePagination?: boolean;
}

export type AnyDocsMetadata = DocsCategoryMetadata | DocsMetadata;
