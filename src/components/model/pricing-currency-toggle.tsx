'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLingo } from '@lingo.dev/react';
import { PRICING_CURRENCIES, type PricingCurrency } from '@/schema/models/pricing-currency';

interface PricingCurrencyToggleProps {
  value: PricingCurrency;
  onValueChange: (value: PricingCurrency) => void;
  className?: string;
}

export function PricingCurrencyToggle({
  value,
  onValueChange,
  className,
}: PricingCurrencyToggleProps) {
  const l = useLingo();
  return (
    <div
      role="group"
      aria-label={l.text('Pricing currency', { context: 'Accessible label for the USD/EUR price currency selector' })}
      className={cn('inline-flex items-center gap-0.5 rounded-md border border-foreground/10 p-0.5', className)}
    >
      {PRICING_CURRENCIES.map(currency => {
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
