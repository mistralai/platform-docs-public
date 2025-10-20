'use client';

import { useMemo } from 'react';

import { FrontMatterDisplayTypeProps } from '@speakeasy-api/docs-md-react';
import { parseTypeStructure } from '@/app/(api)/util/parseTypeStructure';
import { TypeBadge } from './property/components/badge';

export function FrontMatterDisplayType({
  typeInfo,
}: FrontMatterDisplayTypeProps) {
  const displayStructure = useMemo(() => {
    if (!typeInfo) return undefined;
    return parseTypeStructure(typeInfo);
  }, [typeInfo]);

  return (
    <div className="mt-4">
      {displayStructure && (
        <TypeBadge
          size="default"
          overrideVariant="type-number"
          onClickType={() => {}}
          displayStructure={displayStructure}
        />
      )}
    </div>
  );
}
