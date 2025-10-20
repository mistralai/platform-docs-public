'use client';

import React, { Ref, useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import oneDarkCustom, { onelightCustom } from './one-dark-custom';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
  const [copied, setCopied] = useState(false);

  const extractLanguage = (className?: string): string => {
    if (!className) return language;
    const match = className.match(/language-(\w+)/);
    return match ? match[1] : language;
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
  const codeStyle = oneDarkCustom;
  const codeRef = useRef<HTMLPreElement>(null);
  const codeRefLight = useRef<HTMLPreElement>(null);
  const stopScrollTimeout = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    // when scroll set data-scrolling to true
    if (codeRef.current) {
      codeRef.current.addEventListener('scroll', () => {
        if (stopScrollTimeout.current) {
          clearTimeout(stopScrollTimeout.current);
        }
        codeRef.current?.setAttribute('data-scrolling', 'true');
        stopScrollTimeout.current = setTimeout(() => {
          codeRef.current?.setAttribute('data-scrolling', 'false');
        }, 1000);
      });
      // and then set a timeout to set data-scrolling to false that clears the timeout
    }

    return () => {
      if (codeRef.current) {
        codeRef.current.removeEventListener('scroll', () => {});
      }
      if (stopScrollTimeout.current) {
        clearTimeout(stopScrollTimeout.current);
      }
    };
  }, [highlightedLines]);

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
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <Check className="h-[1em] w-[1em]" />
          ) : (
            <Copy className="h-[1em] w-[1em]" />
          )}
        </button>

        <SyntaxHighlighter
          ref={codeRef as Ref<SyntaxHighlighter>}
          language={detectedLanguage}
          style={oneDarkCustom}
          showLineNumbers={showLineNumbers}
          wrapLongLines={wrapLongLines}
          wrapLines={highlightedLines.length > 0}
          lineProps={lineNumber => ({
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
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <Check className="h-[1em] w-[1em]" />
          ) : (
            <Copy className="h-[1em] w-[1em]" />
          )}
        </button>

        <SyntaxHighlighter
          ref={codeRef as Ref<SyntaxHighlighter>}
          language={detectedLanguage}
          style={onelightCustom}
          showLineNumbers={showLineNumbers}
          wrapLongLines={wrapLongLines}
          wrapLines={highlightedLines.length > 0}
          lineProps={lineNumber => ({
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
