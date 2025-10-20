import { useEffect, useMemo, useState } from 'react';
import MiniSearch, { SearchResult } from 'minisearch';
import { DocType } from '@/schema/doc';

export type Hit = SearchResult & {
  url: string;
  title: string;
  description?: string;
  type?: DocType;
  method?: string;
  path?: string;
  category?: string;
  summary?: string;
  isSuggestion?: boolean;
};

type UseSearchHookParams = {
  options?: {
    maxSuggestions?: number;
    documentTypes?: DocType[];
  };
  open?: boolean;
};

export function useSearch({
  options = {},
  open = true,
}: UseSearchHookParams = {}) {
  const { maxSuggestions = 5, documentTypes = ['docs', 'endpoint'] } = options;

  const [mini, setMini] = useState<MiniSearch | null>(null);
  const [docs, setDocs] = useState<
    Record<
      string,
      {
        url: string;
        title: string;
        description?: string;
        body?: string;
        type?: DocType;
        method?: string;
        path?: string;
        category?: string;
        summary?: string;
        suggest_rank?: number;
        breadcrumbs?: { url: string; title: string }[];
      }
    >
  >({});

  useEffect(() => {
    if (!open || mini) return;

    let mounted = true;
    (async () => {
      const [idxRes, docsRes] = await Promise.all([
        fetch('/search-index.json').then(r => r.text()),
        fetch('/search-docs.json').then(r => r.json()),
      ]);

      // Rehydrate MiniSearch with enhanced fields for endpoints
      const ms = MiniSearch.loadJSON(idxRes, {
        fields: [
          'title',
          'description',
          'body',
          'tags',
          'url',
          'path',
          'category',
          'summary',
        ],
        storeFields: [
          'url',
          'title',
          'description',
          'body',
          'type',
          'method',
          'path',
          'category',
        ],
        searchOptions: {
          prefix: true,
          fuzzy: 0.1,
          boost: {
            title: 4,
            method: 3,
            path: 3,
            summary: 2.5,
            tags: 2,
            description: 2,
            category: 1.5,
            body: 0.8,
            url: 3,
          },
          combineWith: 'AND',
        },
        tokenize: s => s.split(/[\s\-_/.:]+/g),
      });

      if (!mounted) return;

      const byId: Record<string, any> = {};

      for (const d of docsRes) byId[d.id] = d;

      setDocs(byId);
      setMini(ms);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const suggestions = useMemo<Hit[]>(() => {
    const all = Object.values(docs).filter(
      d => d.suggest_rank && documentTypes.includes(d.type as DocType)
    );
    all.sort((a, b) => (a.suggest_rank ?? 999) - (b.suggest_rank ?? 999));
    return all.slice(0, maxSuggestions).map(d => ({
      ...d,
      score: 0,
      match: {},
      snippet: '',
      isSuggestion: true,
      suggest_rank: d.suggest_rank,
      url: d.url,
      title: d.title,
      description: d.description,
      body: d.body,
      type: d.type,
      method: d.method,
      path: d.path,
      category: d.category,
      summary: d.summary,
      breadcrumbs: d.breadcrumbs,
      id: `${d.url}-${d.suggest_rank}`,
      terms: [],
      queryTerms: [],
    })) as Hit[];
  }, [docs, maxSuggestions, documentTypes]);

  const search = useMemo(() => {
    if (!mini) return (q: string, filters?: { type?: DocType }) => [] as Hit[];
    return (q: string, filters?: { type?: DocType }): Hit[] => {
      const query = q.trim();
      if (!query) return suggestions;

      const raw = mini.search(query, {
        boost: {
          title: 4,
          method: 3,
          path: 3,
          summary: 2.5,
          description: 2,
          category: 1.5,
          body: 0.8,
          url: 3,
        },
        fuzzy: 0.1,
        prefix: true,
        combineWith: 'AND',
      });

      return raw
        .filter(r => r.score > 1.0)
        .map(r => {
          const d = docs[r.id];
          return {
            ...r,
            ...d,
            snippet: getHighlightedSnippet(
              d?.body || d?.summary || d?.description || '',
              query,
              40
            ),
            isSuggestion: false,
          } as Hit;
        })
        .filter(hit => {
          // Apply document type filter if specified
          if (filters?.type && hit.type !== filters.type) return false;
          // Apply global document types filter
          return documentTypes.includes(hit.type as DocType);
        });
    };
  }, [mini, docs, suggestions, documentTypes]);
  return { ready: !!mini, search };
}

function getHighlightedSnippet(
  text: string,
  query: string,
  snippetLength = 30
): string {
  // 🎛️ Easy tweaking parameters - adjust these to change snippet behavior
  const CONTEXT_CHARS = 20; // Characters to show on each side of match
  const TOTAL_SNIPPET_LENGTH = snippetLength; // Total snippet length
  const ELLIPSIS = '…'; // Character to show when text is truncated

  if (!text) return '';

  const q = query.trim();
  if (!q) {
    return (
      text.slice(0, TOTAL_SNIPPET_LENGTH) +
      (text.length > TOTAL_SNIPPET_LENGTH ? ELLIPSIS : '')
    );
  }

  // Find first match index (case-insensitive) - try whole query first, then individual words
  let idx = text.toLowerCase().indexOf(q.toLowerCase());
  let matchLength = q.length;

  // If no exact match, try to find the best partial match
  if (idx === -1) {
    const words = q.toLowerCase().split(/\s+/);
    let bestMatch = { idx: -1, length: 0 };

    for (const word of words) {
      if (word.length > 1) {
        // Skip very short words
        const wordIdx = text.toLowerCase().indexOf(word);
        if (wordIdx !== -1 && word.length > bestMatch.length) {
          bestMatch = { idx: wordIdx, length: word.length };
        }
      }
    }

    if (bestMatch.idx !== -1) {
      idx = bestMatch.idx;
      matchLength = bestMatch.length;
    } else {
      // No match → just first TOTAL_SNIPPET_LENGTH chars
      return (
        text.slice(0, TOTAL_SNIPPET_LENGTH) +
        (text.length > TOTAL_SNIPPET_LENGTH ? ELLIPSIS : '')
      );
    }
  }

  // Calculate how much space to reserve for context around the match
  // matchLength is already defined above

  // Calculate start position to center the match with CONTEXT_CHARS on each side
  const idealStart = Math.max(0, idx - CONTEXT_CHARS);
  const idealEnd = Math.min(text.length, idx + matchLength + CONTEXT_CHARS);

  // Adjust if we don't have enough content on one side
  let start = idealStart;
  let end = idealEnd;

  // If we have room to expand the snippet to TOTAL_SNIPPET_LENGTH, do so
  const currentLength = end - start;
  if (currentLength < TOTAL_SNIPPET_LENGTH) {
    const extraChars = TOTAL_SNIPPET_LENGTH - currentLength;
    const extraBefore = Math.floor(extraChars / 2);
    const extraAfter = extraChars - extraBefore;

    start = Math.max(0, start - extraBefore);
    end = Math.min(text.length, end + extraAfter);

    // If we couldn't expand backwards, expand forwards more
    if (start === 0 && end - start < TOTAL_SNIPPET_LENGTH) {
      end = Math.min(text.length, start + TOTAL_SNIPPET_LENGTH);
    }
    // If we couldn't expand forwards, expand backwards more
    if (end === text.length && end - start < TOTAL_SNIPPET_LENGTH) {
      start = Math.max(0, end - TOTAL_SNIPPET_LENGTH);
    }
  }

  const before = text.slice(start, idx);
  const match = text.slice(idx, idx + matchLength);
  const after = text.slice(idx + matchLength, end);

  return `${start > 0 ? ELLIPSIS : ''}${before}<mark>${match}</mark>${after}${
    end < text.length ? ELLIPSIS : ''
  }`;
}
