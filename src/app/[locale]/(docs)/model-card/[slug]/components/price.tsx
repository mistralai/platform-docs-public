import { cn } from '@/lib/utils';
import { ModelPricing } from '@/schema/models';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getLingo } from '@/i18n/server';
import type { Locale } from '@/i18n/config';

interface PriceProps {
  isRetired?: boolean;
  pricing: ModelPricing;
  className?: string;
  locale: Locale;
  layout?: 'default' | 'stacked';
}

export function PriceValue({
  value,
  label,
  unit,
  tooltip,
  orientation = 'column',
}: {
  value: number | string;
  label: string;
  unit?: string;
  tooltip?: string;
  orientation?: 'column' | 'row';
}) {
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
            ${value}
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

export async function Price({ pricing, className, locale, layout = 'default' }: PriceProps) {
  const l = await getLingo(locale);
  const inputCostLabel = l.text('Input Cost', { context: 'Tooltip label for input token price' });
  const outputCostLabel = l.text('Output Cost', { context: 'Tooltip label for output token price' });

  const renderContent = () => {
    if (pricing.free) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 cursor-help">
              <span className="text-orange-500 text-lg font-semibold font-mono uppercase leading-[1]">
                $0
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
      return (
        <span className="text-primary-soft text-lg font-semibold font-mono uppercase leading-[1]">
          ${pricing.price}
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
                value={input.price}
                tooltip={input.label ?? inputCostLabel}
                label={input.label ?? input.denominator}
                unit={input.label ? input.denominator : undefined}
                orientation="row"
              />
            ))}
            {pricing.output.map((output, i) => (
              <PriceValue
                key={`output-${output.denominator}-${i}`}
                value={output.price}
                tooltip={output.label ?? outputCostLabel}
                label={output.label ?? output.denominator}
                unit={output.label ? output.denominator : undefined}
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
              value={pricing.input}
              tooltip={inputCostLabel}
              label={pricing.denominator}
            />
            <PriceValue
              value={pricing.output}
              tooltip={outputCostLabel}
              label={pricing.denominator}
            />
          </>
        ) : (
          <>
            <div className="flex min-w-0 flex-wrap divide-x divide-foreground/30 divide-dashed">
              {pricing.input.map((input, i) => (
                <PriceValue
                  key={`${input.denominator}-${i}`}
                  value={input.price}
                  tooltip={inputCostLabel}
                  label={input.denominator}
                />
              ))}
            </div>
            <div className="flex min-w-0 flex-wrap first:pl-0 last:!pr-0 divide-x divide-foreground/30 divide-dashed">
              {pricing.output.map((output, i) => (
                <PriceValue
                  key={`${output.denominator}-${i}`}
                  value={output.price}
                  tooltip={outputCostLabel}
                  label={output.denominator}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {renderContent()}
    </div>
  );
}
