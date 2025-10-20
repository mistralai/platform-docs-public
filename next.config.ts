/** @type {import('next').NextConfig} */
import createMDX from '@next/mdx';
import { remarkDetailsClasses } from './src/lib/remark-prose-details';
import { NextConfig } from 'next';
import {
  admonitionDirective,
  remarkHeadingId,
  remarkOgFromPath,
  remarkFrontmatter,
  remarkGfm,
  remarkDirective,
  remarkAudioToComponent,
} from './src/lib/frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: false,
  },
  rewrites: async () => {
    return [
      {
        source: '/getting-started/introduction',
        destination: '/',
      },
      {
        source: '/api',
        destination: '/api/endpoint/chat',
      },
    ];
  },
  redirects: async () => [
    {
      source: '/models',
      destination: '/getting-started/models',
      permanent: true,
    },
    {
      source: '/deployment/laplateforme/pricing',
      destination: 'https://mistral.ai/pricing',
      permanent: true,
    },
  ],
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    jsx: true,
    jsxImportSource: 'react',
    remarkPlugins: [
      remarkAudioToComponent,
      remarkDirective,
      remarkFrontmatter,
      [remarkMdxFrontmatter, { name: '_fm' }],
      remarkGfm,
      [remarkOgFromPath, { appDocsRoot: 'src/app/(docs)', apiBase: '/api/og' }],
      remarkHeadingId,
      [remarkDetailsClasses],
      admonitionDirective,
    ],
  },
});
export default withMDX(nextConfig);
