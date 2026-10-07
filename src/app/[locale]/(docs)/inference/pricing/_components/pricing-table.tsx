'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PricingCurrencyToggle } from '@/components/model/pricing-currency-toggle';
import { usePricingCurrency } from '@/hooks/use-pricing-currency';
import { Link } from '@/i18n/navigation.client';
import { useLingo } from '@lingo.dev/react';
import {
  findModelBySlug,
  formatPrice,
  getModelUrl,
  Model,
  ModelPricing,
  ModelSlug,
  PricingCurrency,
} from '@/schema';

interface PricingTableProps {
  slugs: ModelSlug[];
  className?: string;
}

/** 90% reduction on the input price => keep 10%. */
const CACHED_INPUT_FACTOR = 0.1;
/** Batch mode halves every displayed price. */
const BATCH_FACTOR = 0.5;
/** Priority mode adds 75% to every displayed price. */
const PRIORITY_FACTOR = 1.75;
/** Regional inference adds 10% to every displayed price. */
const REGIONAL_FACTOR = 1.1;

/** `originalPrice` is set when `price` is a temporary sale price. */
type SidePrice = { price: number; denominator: string; originalPrice?: number };
type Mode = 'standard' | 'batch' | 'priority';

const MODES: {
  value: Mode;
  label: (l: ReturnType<typeof useLingo>) => string;
  factor: number;
  suffix: (l: ReturnType<typeof useLingo>) => string;
  tooltip?: (l: ReturnType<typeof useLingo>) => React.ReactNode;
}[] = [
  { value: 'standard', label: l => l.text('Standard', { context: 'Standard pricing mode label' }), factor: 1, suffix: () => '' },
  {
    value: 'batch',
    label: l => l.text('Batch', { context: 'Topic label for batch API processing' }),
    factor: BATCH_FACTOR,
    suffix: l => ` · ${l.text('Batch', { context: 'Topic label for batch API processing' })} (-50%)`,
    tooltip: l => (
      <>
        {l.text('Batching allows you to run asynchronous inference on large inputs in parallel, reducing compute costs while running large workloads at a 50% discount.', { context: 'Tooltip explaining the batch pricing mode' })}{' '}
        <Link href="/studio/batch-processing" className="text-primary-soft underline-offset-2 hover:underline">
          {l.text('Learn more', { context: 'Link to learn more about the batch pricing mode' })}
        </Link>
      </>
    ),
  },
  {
    value: 'priority',
    label: l => l.text('Priority', { context: 'Priority pricing mode label' }),
    factor: PRIORITY_FACTOR,
    suffix: l => ` · ${l.text('Priority', { context: 'Priority pricing mode label' })} (+75%)`,
    tooltip: l => (
      <>
        {l.text('Priority Tier offers consistent performance for realtime applications. Dedicated priority queues shield your requests from general traffic bursts for faster, more predictable response times (TTFT).', { context: 'Tooltip explaining the priority pricing mode' })}{' '}
        <Link href="/inference/priority-tier" className="text-primary-soft underline-offset-2 hover:underline">
          {l.text('Learn more', { context: 'Link to learn more about the priority pricing mode' })}
        </Link>
      </>
    ),
  },
];

function modeFactor(mode: Mode): number {
  return MODES.find(m => m.value === mode)?.factor ?? 1;
}

function modeSuffix(mode: Mode, l: ReturnType<typeof useLingo>): string {
  return MODES.find(m => m.value === mode)?.suffix(l) ?? '';
}

/**
 * Normalize the three `ModelPricing` shapes (flat, range, custom) into raw
 * numeric { input, output } entries. Returns `undefined` for a side with no
 * price.
 */
function getRawPrices(
  pricing: ModelPricing,
): { input?: SidePrice; cachedInput?: SidePrice; output?: SidePrice } {
  switch (pricing.type) {
    case 'flat':
      return {
        input: { price: pricing.price, denominator: pricing.denominator },
      };
    case 'range':
      return {
        input: { price: pricing.input, denominator: pricing.denominator },
        output: { price: pricing.output, denominator: pricing.denominator },
      };
    case 'custom': {
      const input = pricing.input.find(
        item => item.label?.toLowerCase() !== 'cached input'
      ) ?? pricing.input[0];
      const cachedInput = pricing.input.find(
        item => item.label?.toLowerCase() === 'cached input'
      );
      return {
        input: input && {
          price: input.price,
          denominator: input.denominator,
          originalPrice: input.originalPrice,
        },
        cachedInput: cachedInput && {
          price: cachedInput.price,
          denominator: cachedInput.denominator,
          originalPrice: cachedInput.originalPrice,
        },
        output: pricing.output[0] && {
          price: pricing.output[0].price,
          denominator: pricing.output[0].denominator,
          originalPrice: pricing.output[0].originalPrice,
        },
      };
    }
    default:
      return {};
  }
}

interface RowPrices {
  model: Model;
  isFree: boolean;
  input?: SidePrice;
  cachedInput?: SidePrice;
  output?: SidePrice;
}

function PricingRow({
  row,
  mode,
  regional,
  hideDenominator,
  currency,
  l,
}: {
  row: RowPrices;
  mode: Mode;
  regional: boolean;
  hideDenominator: boolean;
  currency: PricingCurrency;
  l: ReturnType<typeof useLingo>;
}) {
  const { model, isFree, input, cachedInput, output } = row;
  const factor = modeFactor(mode) * (regional ? REGIONAL_FACTOR : 1);
  const modelUrl = getModelUrl(model);
  const onSale = !isFree && [input, cachedInput, output].some(
    side => side?.originalPrice !== undefined
  );

  const renderPrice = (side?: SidePrice, extraFactor = 1) => {
    if (isFree) return l.text('Free', { context: 'Free price label' });
    if (!side) return '—';
    const value = formatPrice(side.price * factor * extraFactor, currency);
    const unit = hideDenominator ? '' : ` ${side.denominator}`;
    if (side.originalPrice === undefined) return `${value}${unit}`;
    const original = formatPrice(side.originalPrice * factor * extraFactor, currency);
    return (
      <span className="inline-flex flex-col items-end md:flex-row md:items-baseline md:gap-x-1.5">
        <del className="text-foreground/65 line-through">
          <span className="sr-only">{l.text('Original price:', { context: 'Screen reader prefix for the struck-through regular price of a model on sale' })} </span>
          {original}
        </del>
        <ins className="no-underline font-semibold">
          <span className="sr-only">{l.text('Sale price:', { context: 'Screen reader prefix for the temporary discounted price of a model on sale' })} </span>
          {value}
        </ins>
        {unit}
      </span>
    );
  };

  return (
    <TableRow>
      <TableCell className="font-medium p-2">
        {modelUrl ? (
          <Link
            href={modelUrl}
            target="_blank"
            className="relative font-semibold text-foreground after:absolute after:-inset-2 hover:text-primary-soft transition-colors"
          >
            {model.name} <span className="font-mono">↗</span>
          </Link>
        ) : (
          <span className="font-semibold text-foreground">{model.name}</span>
        )}
        {onSale && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                size="xs"
                tabIndex={0}
                className="relative mt-1 flex align-middle font-mono uppercase text-[11px] cursor-help md:mt-0 md:ml-3 md:inline-flex"
              >
                {l.text('Sale price', { context: 'Badge marking a model whose listed price is a temporary discount' })}
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-left">
              {l.text('Temporary sale price. The struck-through amount is the original price.', { context: 'Tooltip explaining the sale price badge in the model pricing table' })}
            </TooltipContent>
          </Tooltip>
        )}
      </TableCell>
      <TableCell
        className={cn(
          'p-2 font-mono text-xs 2xl:text-sm text-end',
          isFree && 'text-primary-soft',
        )}
      >
        {renderPrice(input)}
      </TableCell>
      <TableCell
        className={cn(
          'p-2 font-mono text-xs 2xl:text-sm text-end',
          isFree && 'text-primary-soft',
        )}
      >
        {cachedInput ? renderPrice(cachedInput) : renderPrice(input, CACHED_INPUT_FACTOR)}
      </TableCell>
      <TableCell className="p-2 font-mono text-xs 2xl:text-sm text-end">
        {renderPrice(output)}
      </TableCell>
    </TableRow>
  );
}

export default function PricingTable({ slugs, className }: PricingTableProps) {
  const l = useLingo();
  const [mode, setMode] = React.useState<Mode>('standard');
  const [regional, setRegional] = React.useState(false);
  const [currency, setCurrency] = usePricingCurrency();

  const rows: RowPrices[] = slugs
    .map(slug => findModelBySlug(slug))
    .filter((m): m is Model => Boolean(m))
    .map(model => {
      const isFree = model.pricing.free;
      const { input, cachedInput, output } = isFree ? {} : getRawPrices(model.pricing);
      return { model, isFree, input, cachedInput, output };
    });

  if (rows.length === 0) {
    return <p className="text-muted-foreground text-sm">{l.text('No models to display.', { context: 'Empty state for model pricing table' })}</p>;
  }

  // Collect every denominator used in this table. If there's exactly one, hoist
  // it to a mention above the table and omit it from cells.
  const denominators = new Set<string>();
  for (const row of rows) {
    if (row.input) denominators.add(row.input.denominator);
    if (row.cachedInput) denominators.add(row.cachedInput.denominator);
    if (row.output) denominators.add(row.output.denominator);
  }
  const sharedDenominator =
    denominators.size === 1 ? [...denominators][0] : undefined;

  const suffix = modeSuffix(mode, l);
  const showCurrencyToggle = rows.some(row => !row.isFree);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground font-mono">
          {sharedDenominator
            ? `${l.text('Prices', { context: 'Pricing table unit prefix' })} ${sharedDenominator}`
            : l.text('Prices as marked', { context: 'Pricing table unit prefix when prices have different units' })}
          {suffix}
        </span>
        <div className="flex flex-wrap items-center gap-3">
          {showCurrencyToggle && (
            <PricingCurrencyToggle value={currency} onValueChange={setCurrency} />
          )}
          <Label className="font-mono text-xs uppercase cursor-pointer">
            <Checkbox
              checked={regional}
              onCheckedChange={checked => setRegional(checked === true)}
            />
            {l.text('Regional inference', { context: 'Link text to the regional inference documentation' })}{regional ? ' (+10%)' : ''}
          </Label>
          <div
            role="group"
            aria-label={l.text('Pricing mode', { context: 'Accessible label for pricing mode selector' })}
            className="inline-flex items-center gap-0.5 rounded-md border border-foreground/10 p-0.5"
          >
          {MODES.map(m => {
            const active = mode === m.value;
            const button = (
              <Button
                key={m.value}
                size="xs"
                variant={active ? 'secondary' : 'ghost'}
                onClick={() => setMode(m.value)}
                aria-pressed={active}
                className="font-mono uppercase cursor-pointer"
              >
                {m.label(l)}
              </Button>
            );
            return m.tooltip ? (
              <Tooltip key={m.value}>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent className="max-w-xs text-left">
                  {m.tooltip(l)}
                </TooltipContent>
              </Tooltip>
            ) : (
              button
            );
          })}
          </div>
        </div>
      </div>

      <Table className={className}>
        <TableHeader>
          <TableRow>
            <TableHead>{l.text('Model', { context: 'Table heading for the AI model name' })}</TableHead>
            <TableHead className="text-end">{l.text('Input', { context: 'Pricing table input token column heading' })}</TableHead>
            <TableHead className="text-end">{l.text('Cached input', { context: 'Pricing table cached input token column heading' })}</TableHead>
            <TableHead className="text-end">{l.text('Output', { context: 'Tab label for the output/result pane of a multi-language code block' })}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(row => (
            <PricingRow
              key={row.model.slug}
              row={row}
              mode={mode}
              regional={regional}
              hideDenominator={Boolean(sharedDenominator)}
              currency={currency}
              l={l}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
