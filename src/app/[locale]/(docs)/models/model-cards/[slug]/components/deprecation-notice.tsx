import { ClockIcon } from '@/components/icons/pixel';
import { getModelUrl, Model, models } from '@/schema';
import { Link } from '@/i18n/navigation.client';
import React from 'react';
import { ModelCard, ModelCardInner } from './model-card';
import { getLingo } from '@/i18n/server';
import type { Locale } from '@/i18n/config';

interface DeprecationNoticeProps {
  model: Model;
  locale: Locale;
}

export default async function DeprecationNotice({ model, locale }: DeprecationNoticeProps) {
  const l = await getLingo(locale);
  const isRetired = model.status === 'Retired';
  const isDeprecated = model.status === 'Deprecated';

  const replacementModel = models.find(
    m => m.name === model.metadata?.replacement
  );

  const showRetirementDate = isRetired && model.metadata?.retirementDate;
  const showDeprecationDate = isDeprecated && model.metadata?.deprecationDate;
  const dateOptions: Intl.DateTimeFormatOptions = { dateStyle: undefined, year: 'numeric', month: 'numeric', day: 'numeric' };

  return (
    <ModelCard className="relative">
      <ModelCardInner className='max-sm:flex-col'>
        {showRetirementDate && model.metadata?.retirementDate && (
          <DeprecationMessage
            label={l.text('Retirement date', { context: 'Retirement date of an AI model' })}
            value={l.date(new Date(model.metadata.retirementDate), dateOptions)}
          />
        )}
        {showDeprecationDate && model.metadata?.deprecationDate && (
          <DeprecationMessage
            label={l.text('Deprecation date', { context: 'Deprecation date of an AI model' })}
            value={l.date(new Date(model.metadata.deprecationDate), dateOptions)}
          />
        )}
        {replacementModel && (
          <DeprecationMessage
            label={l.text('Replacement', { context: 'Replacement AI model' })}
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
