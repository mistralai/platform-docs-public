import type { ModelPricing } from './schema';

export type PricingCurrency = 'eur' | 'usd';

export const DEFAULT_PRICING_CURRENCY: PricingCurrency = 'eur';

export function pricingCurrencySymbol(currency: PricingCurrency): string {
  return currency === 'eur' ? '€' : '$';
}

export function priceForCurrency(
  priceUsd: number,
  priceEur: number | undefined,
  currency: PricingCurrency,
): number {
  return currency === 'eur' && priceEur !== undefined ? priceEur : priceUsd;
}

export function pricingHasEur(pricing: ModelPricing): boolean {
  if (pricing.free) return false;
  switch (pricing.type) {
    case 'flat':
      return pricing.priceEur !== undefined;
    case 'range':
      return pricing.inputEur !== undefined || pricing.outputEur !== undefined;
    case 'custom':
      return [...pricing.input, ...pricing.output].some(entry => entry.priceEur !== undefined);
  }
}
