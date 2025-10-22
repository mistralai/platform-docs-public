import React, { Suspense } from 'react';
import { PixelGrid } from '@/components/common/pixel-grid';
import { CollabButton } from '@/components/common/collab-button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { BreadcrumbHome } from '@/components/layout/breadcrumb';
import { HeadingTitle } from '@/components/layout/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formateDateMonthYear } from '@/lib/date';
import { Cookbook } from '@/schema/cookbook';
import { GithubIcon } from 'lucide-react';
import Link from 'next/link';

export default function CookbookHeader({
  cookbook,
  date,
  readingTime,
  githubUrl,
  colabUrl,
}: {
  cookbook: Cookbook;
  date?: string; // Make date optional
  readingTime: { minutes: number; words: number; text: string };
  githubUrl?: string | null;
  colabUrl?: string | null;
}) {
  const useCaseTags = cookbook.useCases.map(tag => ({
    label: tag,
    variant: 'yellow' as const,
  }));

  const integrationTags = cookbook.integrations.map(tag => ({
    label: tag,
    variant: 'orange' as const,
  }));

  // Robust distribution: try to get 1 from each array first, then fill remaining
  const displayTags = [];
  const allTags = [...useCaseTags, ...integrationTags];

  // First priority: get one from each category if available
  if (useCaseTags.length > 0) {
    displayTags.push(useCaseTags[0]);
  }
  if (integrationTags.length > 0 && displayTags.length < 2) {
    displayTags.push(integrationTags[0]);
  }

  // Fill remaining slots with any remaining tags
  if (displayTags.length < 2) {
    const remainingTags = [
      ...useCaseTags.slice(displayTags.includes(useCaseTags[0]) ? 1 : 0),
      ...integrationTags.slice(
        displayTags.includes(integrationTags[0]) ? 1 : 0
      ),
    ];

    const slotsToFill = 2 - displayTags.length;
    displayTags.push(...remainingTags.slice(0, slotsToFill));
  }

  const remainingCount = allTags.length - displayTags.length;

  return (
    <div className="not-prose">
      <div className="flex items-center gap-6 font-mono mb-4 w-full">
        <div className="flex items-center gap-3 flex-1">
          <Suspense>
            <Breadcrumb className="shrink-0">
              <BreadcrumbList>
                <BreadcrumbHome />
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/cookbooks">Cookbooks</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </Suspense>

          <Separator orientation="horizontal" className="shrink" />
          <p className="text-xs lg:text-sm text-foreground shrink-0 tracking-wide uppercase font-medium">
            [{readingTime.text}]
          </p>
        </div>
        {(githubUrl || colabUrl) && (
          <div className="space-x-2 shrink-0">
            {githubUrl && (
              <Button
                size={'sm'}
                variant="outline"
                className="uppercase"
                asChild
              >
                <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                  <GithubIcon className="size-4 text-primary" />
                  <span className="max-md:hidden">View on</span> GitHub ↗
                </a>
              </Button>
            )}
            {colabUrl && <CollabButton colabUrl={colabUrl} />}
          </div>
        )}
      </div>

      <section className="group relative overflow-clip p-4 flex flex-col w-full bg-foreground/5 border rounded-lg">
        <PixelGrid
          forceVisible
          speed={3}
          opacity={0.05}
          pixelSize={8}
          className="mix-blend-hard-light"
        />
        <div className="z-10 flex flex-col">
          {/* Only show date if displayDate is true and date exists */}
          {cookbook.displayDate && date && (
            <span className="text-foreground font-mono uppercase font-semibold text-xs">
              {formateDateMonthYear(date)}
            </span>
          )}

          <div className="flex justify-between gap-8 md:gap-16 items-end mt-20">
            <div className="flex flex-col">
              {cookbook.author && (
                <div className="flex items-center gap-3">
                  {typeof cookbook.author === 'string' ? (
                    <div className="flex items-center gap-2">
                      <span className="text-base text-foreground/50 font-mono font-medium">
                        Written By
                      </span>
                      <span className="text-base font-semibold text-foreground">
                        {cookbook.author}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base text-foreground/50 font-mono font-medium">
                          Written By
                        </span>
                      </div>
                      <Link
                        href={cookbook.author.url ?? '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base group/author inline-flex items-center gap-2 text-foreground hover:underline"
                      >
                        <span>{cookbook.author.name}</span>
                        <img
                          src={cookbook.author.img}
                          alt={cookbook.author.name}
                          className="size-4.5 rounded-sm object-cover border border-border group-hover/author:border-foreground/40"
                        />
                      </Link>
                    </div>
                  )}
                </div>
              )}
              <HeadingTitle
                size="h3"
                as="h1"
                className="text-balance max-w-2xl shrink whitespace-pre-wrap"
              >
                {cookbook.title}
              </HeadingTitle>
            </div>
            <div className="flex flex-wrap justify-end gap-1 mt-auto">
              {displayTags.map(({ label, variant }) => (
                <Badge
                  size="sm"
                  key={label}
                  variant={variant}
                  className="md:not-group-hover:border-border font-mono uppercase md:not-group-hover:bg-background dark:md:not-group-hover:text-foreground"
                >
                  {label}
                </Badge>
              ))}
              {remainingCount > 0 && (
                <Badge
                  size="sm"
                  variant="outline"
                  className="font-mono uppercase bg-background"
                >
                  +{remainingCount}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
