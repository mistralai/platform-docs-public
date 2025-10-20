'use client';

import { CopyButton } from '@/components/ui/copy-button';
import * as React from 'react';

export const EndpointItem = ({
  onClick,
  value,
  disabled,
}: {
  onClick?: () => void;
  value: string;
  disabled?: boolean;
}) => {
  return (
    <CopyButton
      disabled={disabled}
      className="text-xs font-mono leading-[1] text-foreground/60 hover:not-disabled:text-foreground disabled:cursor-not-allowed"
      value={value}
    >
      {value}
    </CopyButton>
  );
};
