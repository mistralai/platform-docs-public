import {
  Heading,
  HeadingSubtitle,
  HeadingTitle,
} from '@/components/layout/heading';
import { ModelCard } from '@/components/model/model-card';
import { SectionTab } from '@/components/layout/section-tab';
import { ModelTable } from '@/components/model/model-table';
import { models, nonLegacyModels } from '@/schema';
import {
  FEATURED_MODEL_NAMES_MODELS_PAGE,
  FEATURED_MODELS_COLOR_OVERRIDES,
} from '@/schema/content/models';
import { getLingo } from '@/i18n/server';
import type { Locale } from '@/i18n/config';


export default async function ModelsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const l = await getLingo(locale);
  // Featured models
  const featuredModels = FEATURED_MODEL_NAMES_MODELS_PAGE.map(
    slug => models.find(model => model.slug === slug)!
  ).filter(Boolean);

  // Deprecated / retired models, sorted by most recent deprecation date first
  const legacySlugs = models
    .filter(model => model.status === 'Deprecated' || model.status === 'Retired')
    .sort((a, b) => {
      const dateA = a.metadata?.deprecationDate ?? a.metadata?.retirementDate ?? '';
      const dateB = b.metadata?.deprecationDate ?? b.metadata?.retirementDate ?? '';
      return dateB.localeCompare(dateA);
    })
    .map(model => model.slug);

  return (
    <div className="mx-auto space-y-14 w-full md:pt-8 not-prose">
      {/* Page Header */}
      <div className="space-y-4">
        <Heading align="center">
          <HeadingTitle as="h1">{l.text('Models Overview', { context: 'Main heading for the page listing all AI models' })}</HeadingTitle>
          <HeadingSubtitle>
            {l.text('A list of all our available models, helping you explore their capabilities, performance, trade-offs, and more.', { context: 'Introductory description of the AI model catalog' })}
          </HeadingSubtitle>
        </Heading>
      </div>

      {/* Featured Models */}
      <section id="featured-models" className="flex flex-col gap-6">
        <SectionTab sectionId="featured-models">{l.text('Featured Models', { context: 'Heading for featured AI models' })}</SectionTab>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredModels.map((model, index) => (
            <ModelCard
              overrideColor={FEATURED_MODELS_COLOR_OVERRIDES[index]}
              key={model.name}
              l={l}
              model={model}
              variant="card"
              showParameters={false}
            />
          ))}
        </div>
      </section>

      {/* ALL MODELS */}
      <section id="all-models" className="flex flex-col gap-6">
        <SectionTab sectionId="all-models">{l.text('All models', { context: 'Heading for the full list of currently available AI models' })}</SectionTab>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nonLegacyModels.map(model => (
            <ModelCard
              key={model.name}
              l={l}
              model={model}
              variant="compact"
              showParameters
            />
          ))}
        </div>
      </section>

      {/* DEPRECATED & RETIRED MODELS */}
      <section id="legacy-models" className="flex flex-col gap-6">
        <SectionTab variant="secondary" sectionId="legacy-models">
          {l.text('Deprecated', { context: 'Heading for deprecated and retired AI models' })}
        </SectionTab>
        <Heading align="between">
          <HeadingTitle as="h3" className="text-2xl 2xl:text-3xl">
            {l.text('Deprecated & retired models', { context: 'Subheading for deprecated and retired AI models' })}
          </HeadingTitle>
          <HeadingSubtitle className="md:text-right text-secondary-foreground/85">
            {l.text('Older models that have been deprecated or retired.', { context: 'Description of deprecated or retired AI models' })}
          </HeadingSubtitle>
        </Heading>
        <ModelTable slugs={legacySlugs} forceDeprecated />
      </section>

    </div>
  );
}
