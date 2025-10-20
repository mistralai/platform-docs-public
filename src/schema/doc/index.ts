export type DocType = 'docs' | 'endpoint';

export type BaseDoc = {
  title: string;
  url: string;
  id: string; // stable id (use the URL)
  body: string; // plain text for search
  description?: string;
  tags?: string[];
  suggest_rank?: number;
  breadcrumbs?: { url: string; title: string }[];
  sidebar_position?: number;
  type: DocType;
};

export type DocsDoc = BaseDoc & {
  type: 'docs';
};

export type EndpointDoc = BaseDoc & {
  type: 'endpoint';
  method?: string;
  path?: string;
  operation_id?: string;
  summary?: string;
  category?: string;
  parameters?: string[];
  response_codes?: string[];
};

export type Doc = DocsDoc | EndpointDoc;
