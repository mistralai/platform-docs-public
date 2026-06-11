'use client';

import { useLingo } from '@lingo.dev/react';
import { findModelBySlug, type Model } from '@/schema';
import { ModelCard } from '@/components/model/model-card';

/**
 * Renders a two-column grid of branded model cards from a list of model slugs.
 * Use in MDX to surface a curated set of models, e.g. on a capability overview:
 *
 *   import { ModelCardsBySlug } from '@/components/common/model-cards';
 *
 *   <ModelCardsBySlug slugs={['voxtral-tts-26-03', 'voxtral-mini-transcribe-26-02']} />
 *
 * Each card shows the model's category and version. Unknown slugs are skipped.
 * Cards link to their /models/model-cards/<slug> page.
 */
export function ModelCardsBySlug({ slugs }: { slugs: string[] }) {
  const l = useLingo();
  const items = slugs
    .map(slug => findModelBySlug(slug))
    .filter((model): model is Model => Boolean(model));

  if (items.length === 0) return null;

  return (
    <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
      {items.map(model => (
        <ModelCard
          key={model.name}
          model={model}
          l={l}
          variant="compact"
          showParameters
        />
      ))}
    </div>
  );
}
