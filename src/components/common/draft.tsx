'use client';

// Draft markers for content that is not confirmed yet (DOC-610).
//
//   import { Draft, DraftMark } from '@/components/common/draft';
//
//   <Draft owner="Rakesh" since="Oct 8">What is missing and why.</Draft>
//   Use the <DraftMark note="Default voice PENDING Rakesh">gb_jane_neutral</DraftMark> voice.
//   <DraftSnippet />  (before a code block or a Tabs group: the snippet is temporary)
//
// All three render only in `next dev`, on Vercel previews, or when ALLOW_DOC_DRAFTS=1.
// Any other build (production, the public mirror) fails while a marker remains,
// so drafts can't ship by accident. Find them with: grep -rn "<Draft" src/content

import * as React from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

function assertDraftsAllowed(kind: string) {
  // Server render only: VERCEL_ENV is not exposed to the browser bundle.
  if (typeof window !== 'undefined') return;
  const allowed =
    process.env.NODE_ENV === 'development' ||
    process.env.VERCEL_ENV === 'preview' ||
    process.env.ALLOW_DOC_DRAFTS === '1';
  if (!allowed) {
    throw new Error(
      `<${kind}> found outside dev and previews: resolve or remove draft markers before release (grep -rn "<Draft" src/content).`
    );
  }
}

export function Draft({
  owner,
  since,
  children,
}: {
  owner?: string;
  since?: string;
  children: React.ReactNode;
}) {
  assertDraftsAllowed('Draft');
  const meta = [owner && `pending ${owner}`, since && `since ${since}`]
    .filter(Boolean)
    .join(' · ');

  return (
    <div
      role="note"
      data-draft=""
      className="my-6 rounded-md border-2 border-dashed border-amber-500 bg-amber-100/70 px-4 py-3 text-amber-950 dark:bg-amber-950/50 dark:text-amber-100"
    >
      <div className="font-mono text-xs font-bold uppercase tracking-wide">
        🚧 Temporary draft{meta && ` · ${meta}`} 🚧
      </div>
      <div className="mt-1 text-sm [&>p]:my-1">{children}</div>
    </div>
  );
}

export function DraftMark({
  note,
  children,
}: {
  note: string;
  children: React.ReactNode;
}) {
  assertDraftsAllowed('DraftMark');

  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <mark
          data-draft=""
          tabIndex={0}
          className="cursor-help rounded-sm bg-yellow-200 px-1 py-1 box-decoration-clone text-inherit underline decoration-amber-600 decoration-dotted underline-offset-4 dark:bg-yellow-600/50"
        >
          {children}
        </mark>
      </HoverCardTrigger>
      <HoverCardContent className="w-72 text-xs">🚧 {note}</HoverCardContent>
    </HoverCard>
  );
}

export function DraftSnippet({ note }: { note?: string }) {
  assertDraftsAllowed('DraftSnippet');

  return (
    <div
      role="note"
      data-draft=""
      className="mt-6 mb-2 rounded-md border-2 border-dashed border-amber-500 bg-amber-100/70 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wide text-amber-950 dark:bg-amber-950/50 dark:text-amber-100"
    >
      🚧 Temporary snippet: to be tested on the launch models or provided by Rakesh{note && ` · ${note}`}
    </div>
  );
}
