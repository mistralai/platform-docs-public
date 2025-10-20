'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { cn } from '@/lib/utils';
import type { TimelineYear } from '@/lib/timeline-data';
import { TableOfContents } from '@/components/ui/table-of-contents';

interface TimelineClientProps {
  className?: string;
  timelineData: TimelineYear[];
}

export function TimelineClient({
  className,
  timelineData,
}: TimelineClientProps) {
  const pathname = usePathname();
  const isChangelogPage = pathname === '/getting-started/changelog';

  if (!isChangelogPage) {
    return null;
  }

  return (
    <TableOfContents
      className={cn(className)}
      title="YEAR"
      timelineData={timelineData}
      filters={['model', 'api', 'other', 'security']}
      showBackToTop={true}
    />
  );
}
