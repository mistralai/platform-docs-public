import { ClockIcon } from '@/components/icons/pixel';
import { formatDateNotice } from '@/lib/date';
import { getModelUrl, Model, models } from '@/schema';
import Link from 'next/link';
import React from 'react';
import { ModelCard, ModelCardInner } from './model-card';

interface DeprecationNoticeProps {
  model: Model;
}

export default function DeprecationNotice({ model }: DeprecationNoticeProps) {
  const isRetired = model.status === 'Retired';
  const isDeprecated = model.status === 'Deprecated';

  const hasReplacement = Boolean(model.metadata?.replacement);

  const replacementModel = models.find(
    m => m.name === model.metadata?.replacement
  );

  const showRetirementDate = isRetired && model.metadata?.retirementDate;
  const showDeprecationDate = isDeprecated && model.metadata?.deprecationDate;

  return (
    <ModelCard className="relative">
      <ModelCardInner className='max-sm:flex-col'>
        {showRetirementDate && model.metadata?.retirementDate && (
          <DeprecationMessage
            label="Retirement date"
            value={formatDateNotice(model.metadata.retirementDate)}
          />
        )}
        {showDeprecationDate && model.metadata?.deprecationDate && (
          <DeprecationMessage
            label="Deprecation date"
            value={formatDateNotice(model.metadata.deprecationDate)}
          />
        )}
        {replacementModel && (
          <DeprecationMessage
            label="Replacement"
            value={replacementModel.name}
            link={getModelUrl(replacementModel)}
          />
        )}
      </ModelCardInner>
    </ModelCard>
  );
}

const DeprecationMessage = ({
  label,
  value,
  icon,
  link,
}: {
  label: string;
  value: string;
  icon?: React.ElementType;
  link?: string;
}) => {
  const Icon = icon || ClockIcon;
  return (
    <div className="flex items-center gap-2">
      <div className="border rounded-md p-2">
        <Icon className="size-6 opacity-50" />
      </div>

      <div className="flex flex-col">
        <span className="text-xs text-foreground/50 font-mono uppercase font-medium">
          {label}
        </span>
        {link ? (
          <Link href={link} className="text-lg text-foreground font-bold">
            {value}
          </Link>
        ) : (
          <span className="text-lg text-foreground font-bold">{value}</span>
        )}
      </div>
    </div>
  );
};
