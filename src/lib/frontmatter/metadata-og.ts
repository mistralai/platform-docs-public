import type { Plugin } from 'unified';
import * as acorn from 'acorn';
import { BASE_URL, OG_IMAGE_DIMENSIONS } from '../constants';

type Options = {
  appDocsRoot?: string;
  apiBase?: string;
  maxTitle?: number;
  maxDescription?: number;
};

const clamp = (s: string, n: number) => (s.length > n ? s.slice(0, n) : s);

export const remarkOgFromPath: Plugin<[Options?]> = (opts = {}) => {
  const appDocsRoot = (opts.appDocsRoot ?? 'src/app/(docs)').replace(
    /\\/g,
    '/'
  );
  const apiBase = opts.apiBase ?? '/api/og';
  const MAX_TITLE = opts.maxTitle ?? 120;
  const MAX_DESC = opts.maxDescription ?? 180;

  return function (tree: any, file: any) {
    const abs = String(file.path || '').replace(/\\/g, '/');
    const i = abs.indexOf(appDocsRoot);

    let slug = '';
    if (i >= 0) {
      const rel = abs.slice(i + appDocsRoot.length);
      slug = rel
        .replace(/^\/+/, '')
        .replace(/\/page\.mdx$/i, '')
        .replace(/\.mdx$/i, '')
        .replace(/\.md$/i, '');
    }

    slug = slug.replace(/\//g, ' > ').replace('_', ' ');

    const code = /* ts */ `
      const __fm = (typeof _fm === 'object' && _fm) ? _fm : {};

      let __metadata;

      if (__fm.type === 'api') {
        const __title = __fm.title || __fm.sidebarLabel || 'Api Reference';
        const __description = __fm.description || 'Bienvenue to Mistral AI\\'s Api Reference';

        const __params = new URLSearchParams();
        __params.set('type', 'generic');
        if (__title) __params.set('title', __title);
        __params.set('description', __description);

        const __ogUrl = \`${
          new URL(BASE_URL).origin
        }${apiBase}?\${__params.toString()}\`;

        __metadata = {
          title: __title,
          description: __description,
          openGraph: {
            images: [{ url: __ogUrl, width: ${
              OG_IMAGE_DIMENSIONS.width
            }, height: ${OG_IMAGE_DIMENSIONS.height} }],
          },
          twitter: {
            card: 'summary_large_image',
            images: [__ogUrl],
          },
        };
      } else {
        const __title = __fm.title ? (${clamp.toString()}(String(__fm.title), ${MAX_TITLE})) : '';
        const __description = __fm.description ? (${clamp.toString()}(String(__fm.description), ${MAX_DESC})) : '';
        const __author = __fm.author ? String(__fm.author) : '';
        const __tags = Array.isArray(__fm.tags) ? __fm.tags.map(String) : (typeof __fm.tags === 'string' ? [__fm.tags] : []);
        const __date = __fm.date ? String(__fm.date) : '';

        const __params = new URLSearchParams();
        if (${JSON.stringify(slug)} ) __params.set('eyebraw', ${JSON.stringify(
          slug
        )});
        if (__title) __params.set('title', __title);
        __params.set('type', 'generic');
        __params.set('description', __description || 'Bienvenue to Mistral AI\\'s Documentation');

        const __ogUrl = \`${
          new URL(BASE_URL).origin
        }${apiBase}?\${__params.toString()}\`;

        __metadata = {
          ...__fm,
          openGraph: {
            ...(__fm.openGraph || {}),
            images: [{ url: __ogUrl, width: ${
              OG_IMAGE_DIMENSIONS.width
            }, height: ${OG_IMAGE_DIMENSIONS.height} }],
          },
          twitter: {
            ...(__fm.twitter || {}),
            card: 'summary_large_image',
            images: [__ogUrl],
          },
        };
      }

      export const metadata = __metadata;
    `;

    const program = acorn.parse(code, {
      ecmaVersion: 'latest',
      sourceType: 'module',
    }) as any;

    tree.children.push({
      type: 'mdxjsEsm',
      data: { estree: program },
    });
  };
};
