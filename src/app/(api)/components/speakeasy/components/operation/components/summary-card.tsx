'use client';

import {
  OperationSummarySectionProps,
  OperationTitleSectionProps,
} from '@speakeasy-api/docs-md-react';
import { Children } from 'react';
import { APICopyButton } from '@/app/(api)/components/speakeasy/copy-button';

export const SummaryCard = ({
  summarySection,
  titleSection,
}: {
  summarySection: React.ReactElement<OperationSummarySectionProps>;
  titleSection: React.ReactElement<OperationTitleSectionProps> & {
    props?: { id?: string };
  };
}) => {
  const textToCopy = Children.toArray(titleSection.props?.children)[1];
  const trimmedTextToCopy = textToCopy?.toString().trim();
  const titleId = titleSection.props?.id;

  return (
    <div
      className="rounded-md flex flex-col relative group/summary-card focus:outline-none"
      tabIndex={0}
    >
      <div
        data-type="operation-summary"
        className="text-2xl flex items-center font-bold py-3 px-3 border border-border [&_em]:not-italic rounded-t-md"
      >
        {summarySection}
        {titleId && (
          <APICopyButton
            handleCopy={async () => {
              const url = `${window.location.origin}${window.location.pathname}#${titleId}`;
              await navigator.clipboard.writeText(url);
            }}
            className="group/copy-btn p-2 lg:absolute lg:-left-1.5 lg:-translate-x-full after:absolute after:h-full after:w-1.5 after:-right-1.5"
            buttonClassName="opacity-0 group-focus-visible/copy-btn:opacity-100 group-focus/summary-card:opacity-100 group-hover/summary-card:opacity-100 group-focus/summary-card:opacity-100"
          />
        )}
      </div>
      <div
        data-type="operation-title"
        className="text-sm font-normal font-mono gap-4 text-muted-foreground py-2 px-3 bg-muted flex items-center justify-between rounded-b-md border-b border-x border-border"
      >
        <span data-type="operation-summary-title">{titleSection}</span>
        <APICopyButton value={trimmedTextToCopy} />
      </div>
    </div>
  );
};
