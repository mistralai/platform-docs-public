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

  // Legacy / deprecated models
  const legacySlugs = models
    .filter(model => model.status === 'Deprecated' || model.status === 'Retired')
    .map(model => model.slug);

  // Separate SOTA models (state-of-the-art)
  const frontierModels = nonLegacyModels.filter(model => model.frontier);
  const otherModels = nonLegacyModels.filter(model => !model.frontier);

  // Split SOTA models by class
  const generalistFrontier = frontierModels.filter(m => m.class === 'Generalist');
  const specialistFrontier = frontierModels.filter(m => m.class === 'Specialist');

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

      {/* STATE OF THE ART MODELS */}
      <section id="sota-models" className="flex flex-col gap-8">
        <SectionTab sectionId="frontier-models">{l.text('Frontier Models', { context: 'Heading for frontier AI models' })}</SectionTab>

        {/* Generalist SOTA */}
        <div className="flex flex-col gap-4">
          <Heading align="between">
            <HeadingTitle as="h3">{l.text('Generalist', { context: 'Label for general-purpose models (used as a heading on the Models Overview page and as a class badge on model cards)' })}</HeadingTitle>
            <HeadingSubtitle className="text-secondary-foreground/85">
              {l.text('Versatile, high-performing models suitable for a broad range of tasks.', { context: 'Description of general-purpose frontier AI models' })}
            </HeadingSubtitle>
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generalistFrontier.map(model => (
              <ModelCard
                key={model.name}
                l={l}
                model={model}
                variant="compact"
                showParameters
              />
            ))}
          </div>
        </div>

        {/* Specialist SOTA */}
        <div className="flex flex-col gap-4">
          <Heading align="between">
            <HeadingTitle as="h3">{l.text('Specialist', { context: 'Label for domain-specific models (used as a heading on the Models Overview page and as a class badge on model cards)' })}</HeadingTitle>
            <HeadingSubtitle className="text-secondary-foreground/85">
              {l.text('Models optimized for specific domains or a given purpose.', { context: 'Description of specialist frontier AI models' })}
            </HeadingSubtitle>
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specialistFrontier.map(model => (
              <ModelCard
                key={model.name}
                l={l}
                model={model}
                variant="compact"
                showParameters
              />
            ))}
          </div>
        </div>
      </section>

      {/* OTHER MODELS */}
      <section id="other-models" className="flex flex-col gap-6">
        <SectionTab sectionId="other-models">{l.text('Other Models', { context: 'Heading for other supported AI models' })}</SectionTab>
        <Heading align="between">
          <HeadingTitle as="h3">{l.text('Other Models', { context: 'Subheading for other supported AI models' })}</HeadingTitle>
          <HeadingSubtitle className="text-secondary-foreground/85">
            {l.text('Other supported models available.', { context: 'Description of other supported AI models' })}
          </HeadingSubtitle>
        </Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {otherModels.map(model => (
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

      {/* LEGACY MODELS */}
      <section id="legacy-models" className="flex flex-col gap-6">
        <SectionTab variant="secondary" sectionId="legacy-models">
          {l.text('Legacy/Deprecated', { context: 'Heading for legacy and deprecated AI models' })}
        </SectionTab>
        <Heading align="between">
          <HeadingTitle as="h3" className="text-2xl 2xl:text-3xl">
            {l.text('Legacy Models', { context: 'Subheading for legacy AI models' })}
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
