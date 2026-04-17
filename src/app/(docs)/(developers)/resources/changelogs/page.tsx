import React, { Suspense } from 'react';
import {
  getAllChangelogEntries,
  getMonthFromDate,
  generateTimelineFromChangelogs,
} from '@/lib/content/changelog';
import { ChangelogEntry } from './components/changelog-entry';
import { ChangelogEntry as ChangelogEntryType } from '@/schema/content/changelog';
import {
  Heading,
  HeadingSubtitle,
  HeadingTitle,
} from '@/components/layout/heading';
import { ChangelogMonthWrapper } from './components/changelog-month-wrapper';
import { MobileFilters } from './components/mobile-filters';
import { MonthHeader } from './components/month-header';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'Find out about all the latest changes to our tool.',
  openGraph: {
    title: 'Changelog',
    description: 'Find out about all the latest changes to our tool.',
    type: 'website',
    images: [
      {
        url: '/api/og?title=Changelog&description=Find out about all the latest changes to our tool.&eyebraw=Changelog&image=/ogs/docs.png',
        width: 1200,
        height: 630,
        alt: 'Changelog',
      },
    ],
  },
};

function generateMonthId(monthYear: string): string {
  const [month, year] = monthYear.split(' ');
  return `${month.toLowerCase()}-20${year}`;
}

export default async function Changelog() {
  const entries = await getAllChangelogEntries();
  const timelineData = await generateTimelineFromChangelogs();

  const entriesByMonth = entries.reduce((acc, entry) => {
    if (!entry) {
      console.warn(`[WARN] No entry found for`);
      return acc;
    }
    const month = getMonthFromDate(entry.date);
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(entry);
    return acc;
  }, {} as Record<string, ChangelogEntryType[]>);

  return (
    <div className="max-w-4xl mx-auto flex-1">
      <div className="mb-8 lg:mb-14">
        <Heading className="max-w-2xl not-prose">
          <HeadingTitle className="text-balance" size="h1" as="h1">
            Changelog
          </HeadingTitle>
          <HeadingSubtitle className="text-secondary-foreground/65 text-base">
            Find out about all the latest changes to our tool. You may filter by
            date and type of release.
          </HeadingSubtitle>
        </Heading>
      </div>

      <Suspense>
        <MobileFilters timelineData={timelineData} />
      </Suspense>

      <div>
        {Object.entries(entriesByMonth).map(
          ([month, monthEntries], monthIndex) => (
            <ChangelogMonthWrapper
              key={month}
              monthId={generateMonthId(month)}
              filters={[]}
            >
              <div className="shrink-0 hidden xl:block">
                <MonthHeader month={month} />
              </div>
              <div className="flex-1">
                {monthEntries.map((entry, index) => (
                  <ChangelogEntry
                    key={entry.slug}
                    date={entry.date}
                    monthIndex={monthIndex}
                    index={index}
                    totalLength={monthEntries.length}
                    isLastMonth={
                      monthIndex === Object.entries(entriesByMonth).length - 1
                    }
                  >
                    <div
                      className={cn(
                        'changelog-content',
                        '[&_li_p]:my-0',
                        '[&>ul]:!my-0 [&>ul]:!pl-0',
                        '[&>ul>li]:!font-bold [&>ul>li]:first:mt-0 [&>ul>li]:last:mb-0  [&>ul>li]:!text-secondary-foreground/70',
                        '[&>ul>li>ul>li]:!font-normal [&>ul>li>ul>li]:!text-inherit',
                        '[&>ul>li>[data-bullet]]:bg-foreground/50',
                        '[&>ul>li>[data-bullet]]:bg-transparent',
                        '[&>ul>li>[data-bullet]]:border',
                        '[&>ul>li>[data-bullet]]:border-foreground/50'
                      )}
                    >
                      <entry.Component />
                    </div>
                  </ChangelogEntry>
                ))}
              </div>
            </ChangelogMonthWrapper>
          )
        )}
      </div>

      {entries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No changelogs available at the moment.
          </p>
        </div>
      )}
    </div>
  );
}
