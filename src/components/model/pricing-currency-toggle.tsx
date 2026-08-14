'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PricingCurrency } from '@/schema/models';

interface PricingCurrencyToggleProps {
  value: PricingCurrency;
  onValueChange: (value: PricingCurrency) => void;
  className?: string;
}

const CURRENCIES: PricingCurrency[] = ['usd', 'eur'];

export function PricingCurrencyToggle({
  value,
  onValueChange,
  className,
}: PricingCurrencyToggleProps) {
  return (
    <div
      role="group"
      aria-label="Pricing currency"
      className={cn('inline-flex items-center gap-0.5 rounded-md border border-foreground/10 p-0.5', className)}
    >
      {CURRENCIES.map(currency => {
        const active = value === currency;
        return (
          <Button
            key={currency}
            size="xs"
            variant={active ? 'secondary' : 'ghost'}
            onClick={() => onValueChange(currency)}
            aria-pressed={active}
            className="font-mono uppercase cursor-pointer"
          >
            {currency.toUpperCase()}
          </Button>
        );
      })}
    </div>
  );
}
