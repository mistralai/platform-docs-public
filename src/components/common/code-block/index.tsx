'use client';

import React, { Ref, useEffect, useRef, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import oneDarkCustom, { onelightCustom } from './one-dark-custom';
import { useLingo } from '@lingo.dev/react';

// Register only the languages we actually use across docs + cookbooks.
// This avoids pulling in ~190 prism language modules.
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import toml from 'react-syntax-highlighter/dist/esm/languages/prism/toml';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import powershell from 'react-syntax-highlighter/dist/esm/languages/prism/powershell';

SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('toml', toml);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('powershell', powershell);

const LANGUAGE_ALIASES: Record<string, string> = {
  console: 'bash',
  curl: 'bash',
  jsonl: 'json',
  md: 'markdown',
  plaintext: 'text',
  ps1: 'powershell',
  py: 'python',
  sh: 'bash',
  shell: 'bash',
  text: 'text',
  ts: 'typescript',
  yml: 'yaml',
};

function normalizeLanguage(value?: string): string {
  const normalized = value
    ?.trim()
    .toLowerCase()
    .replace(/[^a-z0-9+#.-].*$/, '');
  if (!normalized) return 'text';
  return LANGUAGE_ALIASES[normalized] ?? normalized;
}

interface CodeBlockProps {
  children: string;
  className?: string;
  showLineNumbers?: boolean;
  language?: string;
  filename?: string;
  highlight?: string;
  wrapLongLines?: boolean;
}

export function CodeBlock({
  children,
  className,
  showLineNumbers = false,
  language = 'text',
  filename,
  highlight,
  wrapLongLines = true,
}: CodeBlockProps) {
  const l = useLingo();
  const [copied, setCopied] = useState(false);

  const extractLanguage = (className?: string): string => {
    if (!className) return normalizeLanguage(language);
    const match = className.match(/language-([^\s]+)/);
    return normalizeLanguage(match ? match[1] : language);
  };

  const getHighlightedLines = (highlight?: string): number[] => {
    if (!highlight) return [];
    return highlight
      .split(',')
      .map(range => {
        if (range.includes('-')) {
          const [start, end] = range.split('-').map(Number);
          return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        }
        return [Number(range)];
      })
      .flat();
  };

  const detectedLanguage = extractLanguage(className);
  const highlightedLines = getHighlightedLines(highlight);
  const codeRef = useRef<HTMLPreElement>(null);
  const stopScrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const element = codeRef.current;
    if (!element) return;

    const onScroll = () => {
      if (stopScrollTimeout.current) {
        clearTimeout(stopScrollTimeout.current);
      }
      element.setAttribute('data-scrolling', 'true');
      stopScrollTimeout.current = setTimeout(() => {
        element.setAttribute('data-scrolling', 'false');
      }, 1000);
    };

    element.addEventListener('scroll', onScroll);
    return () => {
      element.removeEventListener('scroll', onScroll);
      if (stopScrollTimeout.current) {
        clearTimeout(stopScrollTimeout.current);
      }
    };
  }, []);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div data-type="code" className="relative group/code-block">
      {filename && (
        <div className="flex items-center justify-between bg-muted border border-b-0 rounded-t-lg px-4 py-2">
          <span className="text-sm font-medium text-muted-foreground">
            {filename}
          </span>
          <span className="text-xs text-muted-foreground uppercase">
            {detectedLanguage}
          </span>
        </div>
      )}
      <div className="relative hidden dark:block">
        <button
          onClick={copyToClipboard}
          className={cn(
            'absolute top-[0.45em] right-[0.45em] z-10 p-[0.5em] rounded-md',
            'border border-code-foreground/70 text-code-foreground/70 bg-code-background',
            'opacity-0 group-hover/code-block:opacity-100 transition-opacity',
            'hover:border-primary hover:text-primary'
          )}
          aria-label={l.text('Copy code to clipboard', { context: 'Accessible label for copying code' })}
        >
          {copied ? (
            <Check className="h-[1em] w-[1em]" />
          ) : (
            <Copy className="h-[1em] w-[1em]" />
          )}
        </button>

        <SyntaxHighlighter
          ref={codeRef as unknown as Ref<any>}
          language={detectedLanguage}
          style={oneDarkCustom}
          showLineNumbers={showLineNumbers}
          wrapLongLines={wrapLongLines}
          wrapLines={highlightedLines.length > 0}
          lineProps={(lineNumber: number) => ({
            style: {
              backgroundColor: highlightedLines.includes(lineNumber)
                ? 'rgba(255, 255, 255, 0.1)'
                : 'transparent',
            },
          })}
          customStyle={{
            margin: 0,
            borderRadius: filename ? '0 0 0.5rem 0.5rem' : '0.5rem',
            border: '1px solid hsl(var(--border))',
            borderTop: filename ? 'none' : '1px solid hsl(var(--border))',
            overflowX: 'auto',
          }}
          codeTagProps={{
            className: 'text-[0.875rem] font-mono',
          }}
        >
          {children}
        </SyntaxHighlighter>
      </div>
      <div className="relative dark:hidden">
        <button
          onClick={copyToClipboard}
          className={cn(
            'absolute top-[0.45em] right-[0.45em] z-10 p-[0.5em] rounded-md',
            'border border-code-foreground/70 text-code-foreground/70 bg-code-background',
            'opacity-0 group-hover/code-block:opacity-100 transition-opacity',
            'hover:border-primary hover:text-primary'
          )}
          aria-label={l.text('Copy code to clipboard', { context: 'Accessible label for copying code' })}
        >
          {copied ? (
            <Check className="h-[1em] w-[1em]" />
          ) : (
            <Copy className="h-[1em] w-[1em]" />
          )}
        </button>

        <SyntaxHighlighter
          ref={codeRef as unknown as Ref<any>}
          language={detectedLanguage}
          style={onelightCustom}
          showLineNumbers={showLineNumbers}
          wrapLongLines={wrapLongLines}
          wrapLines={highlightedLines.length > 0}
          lineProps={(lineNumber: number) => ({
            style: {
              backgroundColor: highlightedLines.includes(lineNumber)
                ? 'rgba(255, 255, 255, 0.1)'
                : 'transparent',
            },
          })}
          customStyle={{
            margin: 0,
            borderRadius: filename ? '0 0 0.5rem 0.5rem' : '0.5rem',
            border: '1px solid hsl(var(--border))',
            borderTop: filename ? 'none' : '1px solid hsl(var(--border))',
            overflowX: 'auto',
          }}
          codeTagProps={{
            className: 'text-[0.875rem] font-mono',
          }}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
