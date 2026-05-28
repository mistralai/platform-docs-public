import React, { Suspense } from 'react';
import { generateTimelineData } from '@/lib/timeline-data';
import { TimelineClient } from './timeline-client';
import type { Locale } from '@/i18n/config';

export async function Timeline({ className, locale }: { className?: string; locale: Locale }) {
  const timelineData = generateTimelineData(locale);

  return (
    <Suspense>
      <TimelineClient className={className} timelineData={timelineData} />
    </Suspense>
  );
}
