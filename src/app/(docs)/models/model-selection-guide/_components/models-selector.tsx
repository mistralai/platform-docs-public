'use client';
import {
  Heading,
  HeadingSubtitle,
  HeadingTitle,
} from '@/components/layout/heading';
import Combobox from '@/components/ui/combobox';
import { CommandItem } from '@/components/ui/command';
import {
  DEFAULT_BENCHMARK_MODELS,
  ModelSlug,
  nonLegacyModels,
  models,
} from '@/schema';
import { BenchmarkTable } from './benchmark-item';
import { cn } from '@/lib/utils';
import { useQueryState, createParser } from 'nuqs';

/**
 * Normalize any model identifier (slug, apiName, or alias) to the canonical slug.
 * Returns null if no match found.
 */
function normalizeToSlug(identifier: string): ModelSlug | null {
  for (const model of models) {
    // Check slug
    if (model.slug === identifier) {
      return model.slug as ModelSlug;
    }
    // Check apiNames
    if (model.identifiers.apiNames.includes(identifier)) {
      return model.slug as ModelSlug;
    }
    // Check aliases
    if (model.identifiers.aliases?.includes(identifier)) {
      return model.slug as ModelSlug;
    }
  }
  return null;
}

/**
 * Custom parser for model slugs array (1-3 items, comma-separated)
 * Supports: ?models=model1 or ?models=model1,model2 or ?models=model1,model2,model3
 * Normalizes any identifier (slug, apiName, alias) to the canonical slug
 */
const parseAsModelArray = createParser<ModelSlug[]>({
  parse: (value: string) => {
    if (!value) return null;
    const identifiers = value.split(',').filter(Boolean);
    if (identifiers.length === 0) return null;

    // Normalize each identifier to its canonical slug
    const slugs = identifiers
      .map(id => normalizeToSlug(id))
      .filter((slug): slug is ModelSlug => slug !== null);

    if (slugs.length === 0) return null;
    return slugs.slice(0, 3);
  },
  serialize: (value: ModelSlug[]) => {
    return value.join(',');
  },
});

export function ModelsSelector() {
  const [selectedModels, setSelectedModels] = useQueryState(
    'models',
    parseAsModelArray.withDefault(DEFAULT_BENCHMARK_MODELS)
  );

  // Always show 3 columns - pad with defaults if URL has fewer
  const displayModels: ModelSlug[] = (() => {
    if (selectedModels.length >= 3) return selectedModels.slice(0, 3);
    // Fill remaining slots with defaults that aren't already selected
    const remaining = DEFAULT_BENCHMARK_MODELS.filter(
      m => !selectedModels.includes(m)
    );
    return [...selectedModels, ...remaining].slice(0, 3);
  })();

  const handleModelChange = (modelSlug: string | null, index: number) => {
    // on change normalize the model identifier to match the slug and update the URL
    if (modelSlug) {
      if (displayModels.includes(modelSlug as ModelSlug)) {
        return;
      }
      // Always update all 3 to URL
      const newModels = [...displayModels];
      newModels[index] = modelSlug as ModelSlug;
      setSelectedModels(newModels);
    }
  };

  return (
    <div
      id="benchmarks"
      className="pt-4 not-prose space-y-14 scroll-mt-[calc(var(--header)+2rem)]"
    >
      {/* Title and Description */}
      <Heading className="items-center gap-2 w-full">
        <HeadingTitle id="compare-models" size="h1" className="leading-none">
          Compare Models
        </HeadingTitle>
        <HeadingSubtitle className="text-center max-w-2xl w-full text-pretty!">
          Compare our models with each other to select the best one for your
          use case, from pricing to general performance, features, context
          size, and licensing.
        </HeadingSubtitle>
      </Heading>
      {/* Model Selector */}
      <div
        className="relative -mx-inner-sides"
        style={
          {
            '--mobile-width': 'calc(100vw - var(--inner-sides) * 2)',
          } as React.CSSProperties
        }
      >
        <div
          className={cn(
            'grid grid-cols-[var(--mobile-width)_var(--mobile-width)_var(--mobile-width)] md:grid-cols-3 gap-2 relative overflow-x-auto px-inner-sides snap-x snap-mandatory scroll-smooth [-webkit-overflow-scrolling:touch] scrollbar-none',
            'has-[div.model-benchmark-item_[data-benchmark-pricing-index="2"]]:[&_div[data-benchmark-pricing]]:h-11 has-[div.model-benchmark-item_[data-benchmark-pricing-index="2"]]:[&_div[data-benchmark-pricing]]:items-start'
          )}
        >
          {displayModels.map((modelSlug, index) => {
            const selectedElsewhere = displayModels.filter(
              (_, i) => i !== index
            );
            return (
              <div
                className="col-span-1 flex flex-col gap-6 snap-center relative"
                key={index}
              >
                <Combobox
                  className="w-full uppercase font-mono"
                  options={nonLegacyModels.map(model => ({
                    value: model.slug as ModelSlug,
                    label: model.name,
                  }))}
                  value={modelSlug}
                  onValueChange={modelSlug =>
                    handleModelChange(modelSlug, index)
                  }
                  renderItem={({ isSelected, ...props }) => (
                    <CommandItem
                      {...props}
                      disabled={
                        props.disabled ||
                        selectedElsewhere.includes(
                          props.option.value as ModelSlug
                        )
                      }
                    >
                      <div className="w-full flex justify-between items-center">
                        <span className="truncate">{props.option.label}</span>
                        <div
                          className={cn(
                            'size-2 bg-primary opacity-0',
                            isSelected && 'opacity-100',
                            selectedElsewhere.includes(
                              props.option.value as ModelSlug
                            ) && 'opacity-50'
                          )}
                        />
                      </div>
                    </CommandItem>
                  )}
                />
                <BenchmarkTable modelIdentifierOrSlug={modelSlug} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
