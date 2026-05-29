'use client';

import {
  OperationResponseBodyDescriptionSectionProps,
  OperationResponseBodySectionProps,
  SectionContentProps,
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
