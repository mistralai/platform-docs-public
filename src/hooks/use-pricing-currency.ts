'use client';

import useLocalStorageState from '@/hooks/use-local-storage-state';
import {
  DEFAULT_PRICING_CURRENCY,
  isPricingCurrency,
  type PricingCurrency,
} from '@/schema/models/pricing-currency';

const STORAGE_KEY = 'pricingCurrency';

/**
 * Currency used to display model prices. Shared by every price component on
 * the page and persisted in localStorage, so the choice carries over between
 * the pricing page, model cards, and the model selection guide. Server
 * rendering and first paint always use the default (USD).
 */
export function usePricingCurrency(): [PricingCurrency, (currency: PricingCurrency) => void] {
  const [stored, setStored] = useLocalStorageState<PricingCurrency>(STORAGE_KEY, {
    defaultValue: DEFAULT_PRICING_CURRENCY,
  });
  const currency = isPricingCurrency(stored) ? stored : DEFAULT_PRICING_CURRENCY;
  return [currency, setStored];
}
