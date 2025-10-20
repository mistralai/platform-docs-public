import * as React from 'react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/common/code-block';
import { Badge } from '@/components/ui/badge';
import Admonition from '@/components/common/admonition';
import { Bullet } from '@/components/ui/bullet';
import { markdownTableComponents } from '@/components/common/markdown-table';
import { HeadingTitle } from '../layout/heading';
import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import { AudioPlayer } from '../common/audio';
import { Image } from './image';

type HeadingProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
> & {
  color?: 'destructive' | 'default' | 'muted' | 'primary' | null | undefined;
};

type ParagraphProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
>;

type StrongProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>;

type LiProps = React.DetailedHTMLProps<
  React.LiHTMLAttributes<HTMLLIElement>,
  HTMLLIElement
>;

export type AnchorProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

const baseComponents = {
  h1: ({ children, className, ref: _r, ...props }: HeadingProps) => {
    return (
      <HeadingTitle as="h1" className={className} {...props}>
        {children}
      </HeadingTitle>
    );
  },
  h2: ({ children, className, ref: _r, ...props }: HeadingProps) => {
    return (
      <HeadingTitle as="h2" className={className} {...props}>
        {children}
      </HeadingTitle>
    );
  },
  h3: ({ children, className, ref: _r, ...props }: HeadingProps) => {
    return (
      <HeadingTitle as="h3" className={className} {...props}>
        {children}
      </HeadingTitle>
    );
  },
  h4: ({ children, className, ref: _r, ...props }: HeadingProps) => {
    return (
      <HeadingTitle as="h4" className={className} {...props}>
        {children}
      </HeadingTitle>
    );
  },
  h5: ({ children, className, ref: _r, ...props }: HeadingProps) => {
    return (
      <HeadingTitle as="h5" className={className} {...props}>
        {children}
      </HeadingTitle>
    );
  },
  h6: ({ children, className, ref: _r, ...props }: HeadingProps) => {
    return (
      <HeadingTitle as="h6" className={className} {...props}>
        {children}
      </HeadingTitle>
    );
  },
  p: ({ children, className, ref: _r, ...props }: ParagraphProps) => {
    return (
      <p {...props} className={cn('text-secondary-foreground/93', className)}>
        {children}
      </p>
    );
  },
  strong: ({ children, className, ref: _r, ...props }: StrongProps) => {
    return (
      <strong
        {...props}
        className={cn('font-semibold text-foreground', className)}
      >
        {children}
      </strong>
    );
  },
  code: ({ children, className, ...props }: any) => {
    const dataAttrs = props as Record<string, any>;
    const isInline =
      !dataAttrs?.['data-language'] && !className?.includes('language-');

    if (isInline) {
      return (
        <code
          className={cn(
            'relative mx-1 bg-background ring-1 ring-offset-3 ring-offset-background ring-border font-mono after:hidden before:hidden inline-flex items-center justify-center gap-2  rounded text-xs font-semibold text-foreground px-1',
            className
          )}
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <CodeBlock
        className={className}
        language={dataAttrs?.['data-language'] as string}
        filename={dataAttrs?.['data-filename'] as string}
        highlight={dataAttrs?.['data-highlight'] as string}
        showLineNumbers={dataAttrs?.['data-line-numbers'] === 'true'}
      >
        {String(children).replace(/\n$/, '')}
      </CodeBlock>
    );
  },
  pre: ({ children, className, ...props }: any) => {
    const dataAttrs = props as Record<string, any>;

    if (typeof children === 'object' && children && 'props' in children) {
      const codeElement = children as any;
      const codeProps = codeElement.props || {};
      const language = codeProps.className?.replace('language-', '') || 'text';
      const codeContent = codeProps?.children || '';

      return (
        <CodeBlock
          className={className}
          language={language}
          filename={dataAttrs?.['data-filename'] as string}
          highlight={dataAttrs?.['data-highlight'] as string}
          showLineNumbers={dataAttrs?.['data-line-numbers'] === 'true'}
        >
          {String(codeContent).replace(/\n$/, '')}
        </CodeBlock>
      );
    }

    return (
      <pre
        className={cn(
          'mb-4 mt-6 overflow-x-auto rounded-lg border bg-muted p-4',
          className
        )}
        {...props}
      >
        {children}
      </pre>
    );
  },
  Tag: ({
    model,
    api,
    other,
    deprecated,
    fixed,
    security,
    children,
    ...props
  }: {
    model?: boolean;
    api?: boolean;
    other?: boolean;
    deprecated?: boolean;
    fixed?: boolean;
    security?: boolean;
    children?: React.ReactNode;
  }) => {
    let variant:
      | 'model'
      | 'api'
      | 'other'
      | 'deprecated'
      | 'fixed'
      | 'security'
      | undefined;
    let text = '';

    if (model) {
      variant = 'model';
      text = 'MODEL RELEASED';
    } else if (api) {
      variant = 'api';
      text = 'API UPDATED';
    } else if (other) {
      variant = 'other';
      text = 'OTHER';
    } else if (deprecated) {
      variant = 'deprecated';
      text = 'DEPRECATED';
    } else if (fixed) {
      variant = 'fixed';
      text = 'FIXED';
    } else if (security) {
      variant = 'security';
      text = 'SECURITY';
    }

    return (
      <Badge variant={variant} size="sm" {...props}>
        {text || children}
      </Badge>
    );
  },
  Admonition: ({ children, ...props }: { children?: React.ReactNode }) => {
    return <Admonition {...props}>{children}</Admonition>;
  },
  li: ({ children, className, ref: _r, ...props }: LiProps) => {
    return (
      <li
        className={cn(
          'relative list-none text-secondary-foreground',
          className
        )}
        {...props}
      >
        <Bullet
          className="absolute -left-2 top-[0.75em] -translate-y-1/2"
          size="sm"
          data-bullet
        />
        {children}
      </li>
    );
  },
  a: ({ children, className, href, ref: _r, ...props }: AnchorProps) => {
    if (!href) {
      return (
        <span
          className={cn('text-primary-soft hover:text-primary', className)}
          {...props}
        >
          {children}
        </span>
      );
    }
    const isExternal = href.startsWith('http');
    return (
      <Link
        className={cn('text-primary-soft hover:text-primary', className)}
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
      >
        {children}
      </Link>
    );
  },
  ul: ({
    children,
    className,
    ref: _r,
    ...props
  }: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  >) => {
    return (
      <ul
        className={cn('list-none text-secondary-foreground', className)}
        {...props}
      >
        {children}
      </ul>
    );
  },
  Audio: AudioPlayer,
  Image: Image,
  ...markdownTableComponents,
};

export const markdownComponents: MDXComponents =
  baseComponents as unknown as MDXComponents;
export const reactMarkdownComponents =
  baseComponents as unknown as MDXComponents;
