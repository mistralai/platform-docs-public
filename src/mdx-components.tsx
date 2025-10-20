import type { MDXComponents } from 'mdx/types';
import { markdownComponents } from './components/markdown';

export function useMDXComponents(...params: any): MDXComponents {
  return markdownComponents;
}
