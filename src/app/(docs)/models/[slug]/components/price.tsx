import { cn } from '@/lib/utils';
import { ModelPricing } from '@/schema/models';
import { ChevronRightIcon } from '@/components/icons/pixel';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PriceProps {
  isRetired?: boolean;
  pricing: ModelPricing;
  className?: string;
}

export function PriceValue({
  value,
  label,
  tooltip,
}: {
  value: number | string;
  label: string;
  tooltip?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex flex-col gap-1 px-3 first:pl-0 last:!pr-0 cursor-help">
          <span className="text-primary-soft text-base font-semibold font-mono uppercase !leading-none">
            ${value}
          </span>
          <p className="text-xs leading-none uppercase text-foreground/30 font-mono font-semibold whitespace-nowrap">
            {label}
          </p>
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-[200px]">{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export function Price({ pricing, className }: PriceProps) {
  const Content = () => {
    if (pricing.type === 'flat') {
      return (
        <span className="text-primary-soft text-lg font-semibold font-mono uppercase leading-[1]">
          ${pricing.price}
        </span>
      );
    }

    return (
      <div className="flex items-center gap-2">
        {/* Input */}
        {pricing.type === 'range' ? (
          <PriceValue
            value={pricing.input}
            tooltip="Input Cost"
            label={pricing.denominator}
          />
        ) : (
          <div className="flex divide-x divide-foreground/30 divide-dashed">
            {pricing.input.map((input, i) => (
              <PriceValue
                key={`${input.denominator}-${i}`}
                value={input.price}
                tooltip="Input Cost"
                label={input.denominator}
              />
            ))}
          </div>
        )}
        {/* Separator */}
        {pricing.type === 'custom' && pricing.output.length > 0 && (
          <div className="flex -space-x-2.5 opacity-20">
            {Array.from({ length: 3 }).map((_, index) => (
              <ChevronRightIcon
                key={index}
                className="size-4 text-foreground"
              />
            ))}
          </div>
        )}
        {/* Output */}
        {pricing.type === 'range' ? (
          <PriceValue
            value={pricing.output}
            tooltip="Output Cost"
            label={pricing.denominator}
          />
        ) : (
          <div className="flex first:pl-0 last:!pr-0 divide-x divide-foreground/30 divide-dashed">
            {pricing.output.map((output, i) => (
              <PriceValue
                key={`${output.denominator}-${i}`}
                value={output.price}
                tooltip="Output Cost"
                label={output.denominator}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <Content />
    </div>
  );
}
