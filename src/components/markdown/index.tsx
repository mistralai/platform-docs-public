// Split from ./base so client callers (e.g. MDXRemote in client components)
// can import the plain component map without pulling in `server-only` via
// getLingo / Admonition. Server MDX pages import from here to get Tag +
// Admonition; client MDX renderers import from ./base.
import * as React from 'react';
import Admonition from '@/components/common/admonition';
import type { MDXComponents } from 'mdx/types';
import { baseComponents } from './base';
import { Tag } from './tag';

export type { AnchorProps } from './base';

const allComponents = {
  ...baseComponents,
  Admonition: ({ children, ...props }: { children?: React.ReactNode }) => {
    return <Admonition {...props}>{children}</Admonition>;
  },
  Tag,
};

export const markdownComponents: MDXComponents =
  allComponents as unknown as MDXComponents;
export const reactMarkdownComponents =
  allComponents as unknown as MDXComponents;
