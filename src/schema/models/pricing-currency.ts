export type PricingCurrency = 'usd' | 'eur';

export const PRICING_CURRENCIES: PricingCurrency[] = ['usd', 'eur'];

export const DEFAULT_PRICING_CURRENCY: PricingCurrency = 'usd';

/**
 * Fixed USD to EUR rate. Model schemas only store USD prices; every EUR price
 * is derived from them with this rate at render time.
 */
export const USD_TO_EUR = 0.85;

/**
 * Maximum decimals shown per currency. Multiplying by 0.85 adds at most two
 * decimals, so EUR keeps two more than USD: any USD value exact at 5 decimals
 * stays exact in EUR.
 */
const MAX_DECIMALS: Record<PricingCurrency, number> = { usd: 5, eur: 7 };

export function isPricingCurrency(value: unknown): value is PricingCurrency {
  return value === 'usd' || value === 'eur';
}

export function pricingCurrencySymbol(currency: PricingCurrency): string {
  return currency === 'eur' ? '€' : '$';
}

export function convertUsdPrice(priceUsd: number, currency: PricingCurrency): number {
  return currency === 'eur' ? priceUsd * USD_TO_EUR : priceUsd;
}

/**
 * Format a USD price in `currency` without the symbol. Rounds to the
 * currency's maximum decimals to drop float artifacts, then strips trailing
 * zeros (0.1 USD -> "0.085" EUR, 4.0 USD -> "3.4" EUR).
 */
export function formatPriceValue(priceUsd: number, currency: PricingCurrency = 'usd'): string {
  return convertUsdPrice(priceUsd, currency)
    .toFixed(MAX_DECIMALS[currency])
    .replace(/\.?0+$/, '');
}

/** Format a USD price in `currency` with its symbol, e.g. "€0.119". */
export function formatPrice(priceUsd: number, currency: PricingCurrency = 'usd'): string {
  return `${pricingCurrencySymbol(currency)}${formatPriceValue(priceUsd, currency)}`;
}
