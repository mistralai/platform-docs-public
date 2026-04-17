'use client';

import {
  ENABLE_MODEL_TYPE_TOOLTIP,
  MODEL_TYPE_TOOLTIP_CONTENT,
} from '@/schema/models/copyright/type-tooltip';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Badge } from '../ui/badge';
import { Model } from '@/schema';

import { useRouter } from 'next/navigation';
import { ExternalLink } from 'lucide-react';

export const ModelTypeBadge = ({ type }: { type: Model['type'] }) => {
  const isLink = type === 'Labs';
  const router = useRouter();
  return (
    <Tooltip>
      <TooltipTrigger
        {...(isLink && {
          onClick: (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            router.push('/models/labs');
          },
        })}
      >
        <Badge
          variant={
            type === 'Premier'
              ? 'other'
              : type === 'Labs'
                ? 'security'
                : 'type-enum'
          }
          className="font-mono uppercase text-[11px]"
          size="xs"
        >
          <span>{type}</span>
          {isLink && <ExternalLink className="size-4" />}
        </Badge>
      </TooltipTrigger>
      {ENABLE_MODEL_TYPE_TOOLTIP && MODEL_TYPE_TOOLTIP_CONTENT[type] && (
        <TooltipContent>{MODEL_TYPE_TOOLTIP_CONTENT[type]}</TooltipContent>
      )}
    </Tooltip>
  );
};
