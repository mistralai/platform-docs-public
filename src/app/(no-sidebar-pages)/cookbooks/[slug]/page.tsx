import { MDXRemote } from 'next-mdx-remote/rsc';
import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { NotebookRenderer } from './components/notebook-renderer';
import { CookbookSaved, fullCookbooks } from '@/schema';
import {
  getRemarkPluginsForReactMarkdown,
  rehypeHeadingId,
} from '@/lib/markdown/plugins';
import CookbookHeader from './components/header';
import { markdownComponents } from '@/components/markdown';
import { getOGImageUrl } from '@/components/og/helpers';
import { OG_IMAGE_DIMENSIONS } from '@/lib/constants';
import NoSidebarPageLayout from '@/components/layout/no-sidebar-page-layout';
import { TableOfContents } from '@/components/ui/table-of-contents';
import { generateCookbookToc } from './utils/toc';
import { getCookbookContent } from '@/lib/cookbook';
import { remarkCookbookImageBase } from '@/lib/remark-cookbook-images';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { AnchorProps } from '@/components/markdown';

// Add this function at the top of your file (before the component)
function generateCookbookSlug(p: string): string {
  return p
    .replace(/\.(ipynb|md)$/i, '')
    .replace(/\//g, '-')
    .toLowerCase();
}

export async function generateStaticParams() {
  return fullCookbooks.map((entry: CookbookSaved) => ({
    slug: entry.slug,
  }));
}

// Generate metadata for each cookbook page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = fullCookbooks.find(
    (cookbook: CookbookSaved) => cookbook.slug === slug
  );

  if (!entry) {
    return {
      title: 'Cookbook Not Found',
      description: 'The requested cookbook could not be found.',
    };
  }

  const title = `${entry.title} - Mistral AI Cookbook`;
  const description = `Learn ${entry.title} with practical examples and code snippets using Mistral AI's LLMs.`;
  const ogImageUrl = getOGImageUrl({
    path: 'generic',
    eyebraw: 'COOKBOOK',
    title: entry.title,
    description,
    image: '/ogs/cookbook-item.png',
    titleFontSize: 56,
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://docs.mistral.ai/cookbooks/${slug}`,
      images: [
        {
          url: ogImageUrl,
          width: OG_IMAGE_DIMENSIONS.width,
          height: OG_IMAGE_DIMENSIONS.height,
          alt: 'Mistral AI Documentation',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: [ogImageUrl],
    },
  };
}

export default async function CookbookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const entry = fullCookbooks.find(
    (cookbook: CookbookSaved) => cookbook.slug === slug
  );

  if (!entry) notFound();

  const content = await getCookbookContent(entry.path, { withTitle: false });

  const date = entry.date ?? '';
  const isNotebook = entry.type === 'ipynb';

  const toc = generateCookbookToc(content, isNotebook);

  if (!content) notFound();
  return (
    <NoSidebarPageLayout className="lg:max-w-5xl max-md:pt-sides" noSpacing>
      {/* Header */}
      <CookbookHeader
        cookbook={entry}
        //date={entry.displayDate ? entry.date : undefined} // Only pass date if displayDate is true
        readingTime={entry.readingTime}
        githubUrl={entry.githubUrl}
        colabUrl={entry.colabUrl}
      />

      <div className="relative flex gap-8 mt-14">
        {/* Table of Contents */}

        <TableOfContents
          className="hidden xl:flex h-auto w-64 shrink-0 self-stretch"
          maxDepth={3}
          showBackToTop={true}
          title="Contents"
          tocItems={toc}
        />

        {/* Content */}
        <div className="flex-1 min-w-0 max-w-2xl">
          <div data-cookbook-content>
            {isNotebook ? (
              <Content
                content={content}
                cookbookPath={entry.path}
                cookbookSlug={entry.slug}
              />
            ) : (
              <article className="prose prose-neutral max-w-none">
                <MDXRemote
                  components={{
                    ...markdownComponents,
                    a: ({
                      children,
                      className,
                      href,
                      ...props
                    }: AnchorProps) => {
                      if (
                        href &&
                        !href.startsWith('http') &&
                        !href.startsWith('#')
                      ) {
                        // Handle internal markdown links
                        const slug = generateCookbookSlug(
                          `${entry.path.split('/').slice(0, -1).join('/')}/${href}`
                        );
                        const isExternal = false; // We're making it internal

                        return (
                          <Link
                            href={`/cookbooks/${slug}`}
                            className={cn(
                              'text-primary-soft hover:text-primary',
                              className
                            )}
                            target={isExternal ? '_blank' : undefined}
                            rel={isExternal ? 'noopener noreferrer' : undefined}
                            {...props}
                          >
                            {children}
                          </Link>
                        );
                      }

                      // For external links or anchors, use the original markdownComponents.a behavior
                      if (!href) {
                        return (
                          <span
                            className={cn(
                              'text-primary-soft hover:text-primary',
                              className
                            )}
                            {...props}
                          >
                            {children}
                          </span>
                        );
                      }

                      const isExternal = href.startsWith('http');
                      return (
                        <Link
                          href={`/cookbooks/${slug}`}
                          className={cn('text-primary-soft hover:text-primary', className)}
                          target={isExternal ? '_blank' : undefined}
                          rel={isExternal ? 'noopener noreferrer' : undefined}
                          {...props}
                        >
                          {children}
                        </Link>
                      );
                    },
                  }}
                  source={content}
                  options={{
                    mdxOptions: {
                      remarkPlugins: [
                        ...getRemarkPluginsForReactMarkdown(),
                        [
                          remarkCookbookImageBase,
                          {
                            basePrefix: `/${entry.path.split('/').slice(0, -1).join('/')}`,
                          },
                        ],
                      ],
                      rehypePlugins: [rehypeHeadingId],
                      format: 'md',
                    },
                    parseFrontmatter: true,
                  }}
                />
              </article>
            )}
          </div>
        </div>
      </div>
    </NoSidebarPageLayout>
  );
}

// ------------------------------------------------------------
// Semantic Components
// ------------------------------------------------------------
const Content = ({
  content,
  cookbookPath,
  cookbookSlug,
}: {
  content: string;
  cookbookPath: string;
  cookbookSlug: string;
}) => {
  try {
    const notebook = JSON.parse(content);
    return (
      <NotebookRenderer
        notebook={notebook}
        cookbookPath={cookbookPath}
        cookbookSlug={cookbookSlug}
      />
    );
  } catch (e) {
    console.error(e);
    throw e;
  }
};
