'use client';

import {
  OperationResponseBodyDescriptionSectionProps,
  OperationResponseBodySectionProps,
  SectionContentProps,
  SectionTitleProps,
} from '@speakeasy-api/docs-md-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

export const OperationResponseBodySection = ({
  children,
  ...props
}: OperationResponseBodySectionProps) => {
  return (
    <div data-type="operation-response-body" {...props}>
      {children}
    </div>
  );
};

export const OperationResponseBodySectionContent = ({
  children,
  ...props
}: SectionContentProps) => {
  return (
    <div data-type="operation-response-body-content" {...props}>
      {children}
    </div>
  );
};

export const OperationResponseBodyDescriptionSection = ({
  children,
  slot: _slot,
  ...props
}: OperationResponseBodyDescriptionSectionProps) => {
  return (
    <div
      data-type="operation-response-body-description"
      slot="operation-response-body-description"
      className={cn('text-base font-bold mb-2')}
      {...props}
    >
      {children}
    </div>
  );
};

// Local wrapper: docs-md (via postprocess-mdx) emits
// <OperationResponsesSectionTitle slot="responses-title"> to isolate the
// responses-section heading, but the npm package does not ship it. Render it as
// a section title, consistent with SectionTitle.
export const OperationResponsesSectionTitle = ({
  children,
  slot,
  id,
}: SectionTitleProps) => {
  return (
    <div
      data-type="operation-responses-section-title"
      className={cn('font-semibold text-lg')}
      slot={slot}
      id={id}
    >
      {children}
    </div>
  );
};
