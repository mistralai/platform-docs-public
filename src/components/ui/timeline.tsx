import React, { Suspense } from 'react';
import { generateTimelineData } from '@/lib/timeline-data';
import { TimelineClient } from './timeline-client';

export async function Timeline({ className }: { className?: string }) {
  const timelineData = generateTimelineData();

  return (
    <Suspense>
      <TimelineClient className={className} timelineData={timelineData} />
    </Suspense>
  );
}
