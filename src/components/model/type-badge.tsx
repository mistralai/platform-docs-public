'use client';

import { ENABLE_MODEL_TYPE_TOOLTIP } from '@/schema/models/copyright/type-tooltip';
import { modelType, modelTypeTooltip } from '@/schema/models/i18n';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Badge } from '../ui/badge';
import { Model } from '@/schema';

import { useRouter } from '@/i18n/navigation.client';
import { useLingo } from '@lingo.dev/react';
import { ExternalLink } from 'lucide-react';

export const ModelTypeBadge = ({
  type,
  licenses = [],
}: {
  type: Model['type'];
  licenses?: string[];
}) => {
  const isLink = type === 'Labs';
  const router = useRouter();
  const l = useLingo();
  // Show the weights license when available; fall back to the tier label
  // (e.g. "Premier" for proprietary models without open weights).
  const label = licenses.length > 0 ? licenses.join(' / ') : modelType(type, l);
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
          <span>{label}</span>
          {isLink && <ExternalLink className="size-4" />}
        </Badge>
      </TooltipTrigger>
      {ENABLE_MODEL_TYPE_TOOLTIP && (
        <TooltipContent>{modelTypeTooltip(type, l)}</TooltipContent>
      )}
    </Tooltip>
  );
};
