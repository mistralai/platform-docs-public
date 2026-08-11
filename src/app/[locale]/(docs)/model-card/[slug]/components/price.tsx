'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  DEFAULT_PRICING_CURRENCY,
  ModelPricing,
  priceForCurrency,
  PricingCurrency,
  pricingCurrencySymbol,
  pricingHasEur,
} from '@/schema/models';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PricingCurrencyToggle } from '@/components/model/pricing-currency-toggle';
import { useLingo } from '@lingo.dev/react';
import type { Locale } from '@/i18n/config';

interface PriceProps {
  isRetired?: boolean;
  pricing: ModelPricing;
  className?: string;
  locale: Locale;
  layout?: 'default' | 'stacked';
}

function formatPriceValue(value: number): string {
  return String(Number(value.toFixed(5)));
}

export function PriceValue({
  value,
  label,
  unit,
  tooltip,
  currency,
  orientation = 'column',
}: {
  value: number;
  label: string;
  unit?: string;
  tooltip?: string;
  currency: PricingCurrency;
  orientation?: 'column' | 'row';
}) {
  const currencySymbol = pricingCurrencySymbol(currency);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'min-w-0 cursor-help',
            orientation === 'row'
              ? 'grid grid-cols-[5rem_minmax(7rem,1fr)] items-start gap-x-4 gap-y-1 py-2'
              : 'flex flex-col gap-1 px-3 first:pl-0 last:!pr-0'
          )}
        >
          <span className="text-primary-soft text-base font-semibold font-mono uppercase !leading-none">
            {currencySymbol}{formatPriceValue(value)}
          </span>
          <p className="text-xs leading-tight uppercase text-foreground/30 font-mono font-semibold">
            {label}
            {unit && <span className="block whitespace-nowrap">{unit}</span>}
          </p>
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-[200px]">{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export function Price({ pricing, className, layout = 'default' }: PriceProps) {
  const l = useLingo();
  const [currency, setCurrency] = React.useState<PricingCurrency>(DEFAULT_PRICING_CURRENCY);
  const showCurrencyToggle = pricingHasEur(pricing);
  const inputCostLabel = l.text('Input Cost', { context: 'Tooltip label for input token price' });
  const outputCostLabel = l.text('Output Cost', { context: 'Tooltip label for output token price' });

  const renderContent = () => {
    if (pricing.free) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 cursor-help">
              <span className="text-orange-500 text-lg font-semibold font-mono uppercase leading-[1]">
                {l.text('Free', { context: 'Free price label' })}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-[200px]">
            {l.text('Free for a limited amount of time.', { context: 'Note that the AI model is temporarily free' })}
          </TooltipContent>
        </Tooltip>
      );
    }

    if (pricing.type === 'flat') {
      const price = priceForCurrency(pricing.price, pricing.priceEur, currency);
      return (
        <span className="text-primary-soft text-lg font-semibold font-mono uppercase leading-[1]">
          {pricingCurrencySymbol(currency)}{formatPriceValue(price)}
        </span>
      );
    }

    if (pricing.type === 'custom') {
      if (layout === 'stacked') {
        return (
          <div className="flex min-w-0 flex-col divide-y divide-foreground/30 divide-dashed">
            {pricing.input.map((input, i) => (
              <PriceValue
                key={`input-${input.denominator}-${i}`}
                value={priceForCurrency(input.price, input.priceEur, currency)}
                tooltip={input.label ?? inputCostLabel}
                label={input.label ?? input.denominator}
                unit={input.label ? input.denominator : undefined}
                currency={currency}
                orientation="row"
              />
            ))}
            {pricing.output.map((output, i) => (
              <PriceValue
                key={`output-${output.denominator}-${i}`}
                value={priceForCurrency(output.price, output.priceEur, currency)}
                tooltip={output.label ?? outputCostLabel}
                label={output.label ?? output.denominator}
                unit={output.label ? output.denominator : undefined}
                currency={currency}
                orientation="row"
              />
            ))}
          </div>
        );
      }
    }

    return (
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        {pricing.type === 'range' ? (
          <>
            <PriceValue
              value={priceForCurrency(pricing.input, pricing.inputEur, currency)}
              tooltip={inputCostLabel}
              label={pricing.denominator}
              currency={currency}
            />
            <PriceValue
              value={priceForCurrency(pricing.output, pricing.outputEur, currency)}
              tooltip={outputCostLabel}
              label={pricing.denominator}
              currency={currency}
            />
          </>
        ) : (
          <>
            <div className="flex min-w-0 flex-wrap divide-x divide-foreground/30 divide-dashed">
              {pricing.input.map((input, i) => (
                <PriceValue
                  key={`${input.denominator}-${i}`}
                  value={priceForCurrency(input.price, input.priceEur, currency)}
                  tooltip={inputCostLabel}
                  label={input.denominator}
                  currency={currency}
                />
              ))}
            </div>
            <div className="flex min-w-0 flex-wrap first:pl-0 last:!pr-0 divide-x divide-foreground/30 divide-dashed">
              {pricing.output.map((output, i) => (
                <PriceValue
                  key={`${output.denominator}-${i}`}
                  value={priceForCurrency(output.price, output.priceEur, currency)}
                  tooltip={outputCostLabel}
                  label={output.denominator}
                  currency={currency}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {showCurrencyToggle && (
        <PricingCurrencyToggle
          value={currency}
          onValueChange={setCurrency}
          className="w-fit self-start"
        />
      )}
      {renderContent()}
    </div>
  );
}
