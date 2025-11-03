import React from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { firstImageDataUrl, normalizeStr } from '@/lib/cookbook';
import { markdownComponents } from '@/components/markdown';
import { CodeBlock } from '@/components/common/code-block';
import * as MultiCodeBlock from '@/components/common/multi-codeblock';
import { Prose } from '@/components/common/prose';
import { getRemarkPluginsForReactMarkdown } from '@/lib/markdown/plugins';
import { rehypeHeadingId } from '@/lib/markdown/plugins';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type NBCell = {
  id?: string;
  cell_type: 'markdown' | 'code' | string;
  source: string | string[];
  attachments?: any;
  execution_count?: number | null;
  outputs?: any[];
  metadata?: {
    language?: string;
  };
};

type Notebook = {
  cells?: NBCell[];
  metadata?: any;
};

export function NotebookRenderer({
  notebook,
  cookbookPath,
  cookbookSlug,
}: {
  notebook: Notebook;
  cookbookPath: string;
  cookbookSlug: string;
}) {
  if (!notebook?.cells || notebook.cells.length === 0) {
    return <div className="text-sm text-neutral-500">No cells to display.</div>;
  }

  /**
   * "metadata": {
    "colab": {
      "provenance": []
    },
    "kernelspec": {
      "display_name": "Python 3",
      "language": "python",
      "name": "python3"
    },
    "language_info": {
      "codemirror_mode": {
        "name": "ipython",
        "version": 3
      },
      "file_extension": ".py",
      "mimetype": "text/x-python",
      "name": "python",
      "nbconvert_exporter": "python",
      "pygments_lexer": "ipython3",
      "version": "3.12.3"
    }
  },
   */
  const language = notebook.metadata?.language_info?.name || 'python';

  return (
    <Prose className="mx-auto max-w-3xl">
      {notebook.cells.map((cell, idx) => {
        if (cell.cell_type === 'markdown') {
          return (
            <MarkdownCell
              key={cell.id || idx}
              cell={cell}
              cookbookPath={cookbookPath}
            />
          );
        }
        if (cell.cell_type === 'code') {
          return (
            <CodeCell language={language} key={cell.id || idx} cell={cell} />
          );
        }
        // Fallback: show raw source
        const source = Array.isArray(cell.source)
          ? cell.source.join('')
          : cell.source || '';
        return (
          <CodeBlock
            key={cell.id || idx}
            className="my-4 overflow-auto rounded-lg bg-neutral-50 p-3 text-sm text-neutral-800"
          >
            {source}
          </CodeBlock>
        );
      })}
    </Prose>
  );
}

// ------------------------------------------------------------
// Cells
// ------------------------------------------------------------
function CodeCell({
  cell,
  language = 'python',
}: {
  cell: NBCell;
  language?: string;
}) {
  const source = Array.isArray(cell.source)
    ? cell.source.join('')
    : cell.source || '';

  const languageLabel = language.charAt(0).toUpperCase() + language.slice(1);

  const isOutput = Array.isArray(cell.outputs) && cell.outputs.length > 0;

  if (!isOutput) {
    return <CodeBlock language={language}>{source}</CodeBlock>;
  }

  return (
    <div>
      <MultiCodeBlock.Tabs>
        <MultiCodeBlock.TabItem value="code" label={languageLabel}>
          <CodeBlock language={language}>{source}</CodeBlock>
        </MultiCodeBlock.TabItem>
        <MultiCodeBlock.TabItem value="output" label="Output">
          <div className="space-y-3">
            {cell.outputs!.map((output, i) => (
              <CodeOutput key={i} output={output} />
            ))}
          </div>
        </MultiCodeBlock.TabItem>
      </MultiCodeBlock.Tabs>
    </div>
  );
}

function CodeOutput({ output }: { output: any }) {
  // stream output (stdout/stderr)
  if (output?.output_type === 'stream') {
    const text = Array.isArray(output.text)
      ? output.text.join('')
      : output.text || '';

    return <CodeBlock language="python">{text}</CodeBlock>;
  }

  // execution/display data (images or text)
  if (
    output?.output_type === 'execute_result' ||
    output?.output_type === 'display_data'
  ) {
    const data = output.data || {};
    const img = firstImageDataUrl(data);
    if (img) {
      return <img className="rounded-lg" alt="output" src={img.src} />;
    }
    if (data['text/plain']) {
      const text = normalizeStr(data['text/plain']);
      return <CodeBlock className="text-xs">{text}</CodeBlock>;
    }
  }

  // error output
  if (output?.output_type === 'error') {
    return (
      <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
        <div className="font-semibold">
          {output.ename}: {output.evalue}
        </div>
        {Array.isArray(output.traceback) && (
          <pre className="mt-2 whitespace-pre-wrap text-red-900">
            {output.traceback.join('\n')}
          </pre>
        )}
      </div>
    );
  }

  // unknown/empty
  return null;
}

function MarkdownCell({
  cell,
  cookbookPath,
}: {
  cell: NBCell;
  cookbookPath: string;
}) {
  const raw = Array.isArray(cell.source)
    ? cell.source.join('')
    : cell.source || '';

  function generateCookbookSlug(p: string): string {
    return p
      .replace(/\.(ipynb|md)$/i, '')
      .replace(/\//g, '-')
      .toLowerCase();
  }

  function resolveNotebookPath(currentPath: string, href: string): string {
    const parts = currentPath.split('/');
    const currentFilename = parts[parts.length - 1];
    const currentDir = parts.slice(0, -1).join('/');
    let cleanHref = href;

    // Handle trailing slash (directory reference)
    if (href.endsWith('/')) {
      cleanHref = href.slice(0, -1);

      if (cleanHref.startsWith('../')) {
        const upLevels = (cleanHref.match(/\.\.\//g) || []).length;
        const remainingPath = cleanHref.replace(/(\.\.\/)+/, '');
        const dirParts = remainingPath.split('/');
        const dirName = dirParts[dirParts.length - 1];
        const parentParts = currentDir.split('/').slice(0, -upLevels);
        const parentDir = parentParts.join('/');
        return `${parentDir}/${remainingPath}/${dirName}.ipynb`;
      } else if (cleanHref.startsWith('./')) {
        const dirPath = cleanHref.substring(2);
        const dirParts = dirPath.split('/');
        const dirName = dirParts[dirParts.length - 1];
        return `${currentDir}/${dirPath}/${dirName}.ipynb`;
      } else {
        const dirParts = cleanHref.split('/');
        const dirName = dirParts[dirParts.length - 1];
        return `${currentDir}/${cleanHref}/${dirName}.ipynb`;
      }
    } else {
      if (cleanHref.startsWith('../')) {
        const upLevels = (cleanHref.match(/\.\.\//g) || []).length;
        const remainingPath = cleanHref.replace(/(\.\.\/)+/, '');
        const parentParts = currentDir.split('/').slice(0, -upLevels);
        const parentDir = parentParts.join('/');
        return `${parentDir}/${remainingPath}`;
      } else if (cleanHref.startsWith('./')) {
        return `${currentDir}/${cleanHref.substring(2) || currentFilename}`;
      } else {
        return `${currentDir}/${cleanHref || currentFilename}`;
      }
    }
  }

  const components = {
    ...markdownComponents,
    a: ({ children, className, href, ...props }: any) => {
      // Skip external and anchor links
      if (href.startsWith('http') || href.startsWith('#')) {
        return (
          <a
            href={href}
            className={cn('text-primary-soft hover:text-primary', className)}
            {...(href.startsWith('http')
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
            {...props}
          >
            {children}
          </a>
        );
      }

      // Resolve the full path
      let fullPath;
      if (href.endsWith('/')) {
        fullPath = resolveNotebookPath(cookbookPath, href);
      } else {
        fullPath = resolveNotebookPath(cookbookPath, href);
        if (!fullPath.endsWith('.ipynb') && !fullPath.endsWith('.md')) {
          fullPath += '.ipynb';
        }
      }

      const slug = generateCookbookSlug(fullPath);
      return (
        <Link
          href={`/cookbooks/${slug}`}
          className={cn('text-primary-soft hover:text-primary', className)}
          {...props}
        >
          {children}
        </Link>
      );
    },
    img: ({ src, ...props }: any) => {
      // Restored image handling
      // If it's a base64 attachment, return the img directly
      if (src.startsWith('data:image/')) {
        return <img {...props} src={src} />;
      }
      // Handle attachment images
      if (src.startsWith('attachment:')) {
        const attachmentKey = src.replace('attachment:', '');
        const attachment = cell.attachments?.[attachmentKey];
        if (attachment) {
          const keys = Object.keys(attachment);
          const key = keys[0];
          const base64Data = attachment[key];
          return (
            <img
              {...props}
              src={`data:image/png;base64,${base64Data}`}
              alt={key}
            />
          );
        }
      }
      // Handle regular image paths
      if (!src || src.startsWith('http') || src.startsWith('/')) {
        return <img {...props} src={src} />;
      }
      // Remove filename from path to get directory
      const cookbookDir = cookbookPath.replace(/\/[^/]+$/, '');
      const imagePath = `/cookbooks/${cookbookDir}/${src.replace(/^\.\//, '')}`;
      return <img {...props} src={imagePath} />;
    },
  };

  return (
    <MDXRemote
      components={components}
      source={raw}
      options={{
        mdxOptions: {
          remarkPlugins: getRemarkPluginsForReactMarkdown(),
          rehypePlugins: [rehypeHeadingId],
          format: 'md',
        },
      }}
    />
  );
}
