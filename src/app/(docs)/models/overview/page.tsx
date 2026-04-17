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


export default function ModelsPage() {
  // Featured models
  const featuredModels = FEATURED_MODEL_NAMES_MODELS_PAGE.map(
    slug => models.find(model => model.slug === slug)!
  ).filter(Boolean);

  // Legacy / deprecated models
  const legacyModels = models.filter(
    model => model.status === 'Deprecated' || model.status === 'Retired'
  );

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
          <HeadingTitle as="h1">Models Overview</HeadingTitle>
          <HeadingSubtitle>
            A list of all our available models, helping you explore their capabilities, performance, trade-offs, and more.
          </HeadingSubtitle>
        </Heading>
      </div>

      {/* Featured Models */}
      <section id="featured-models" className="flex flex-col gap-6">
        <SectionTab sectionId="featured-models">Featured Models</SectionTab>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredModels.map((model, index) => (
            <ModelCard
              overrideColor={FEATURED_MODELS_COLOR_OVERRIDES[index]}
              key={model.name}
              model={model}
              variant="card"
              showParameters={false}
            />
          ))}
        </div>
      </section>

      {/* STATE OF THE ART MODELS */}
      <section id="sota-models" className="flex flex-col gap-8">
        <SectionTab sectionId="frontier-models">Frontier Models</SectionTab>

        {/* Generalist SOTA */}
        <div className="flex flex-col gap-4">
          <Heading align="between">
            <HeadingTitle as="h3">Generalist</HeadingTitle>
            <HeadingSubtitle className="text-secondary-foreground/85">
              Versatile, high-performing models suitable for a broad range of
              tasks.
            </HeadingSubtitle>
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generalistFrontier.map(model => (
              <ModelCard
                key={model.name}
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
            <HeadingTitle as="h3">Specialist</HeadingTitle>
            <HeadingSubtitle className="text-secondary-foreground/85">
              Models fine-tuned for specific domains or optimized for a given
              purpose.
            </HeadingSubtitle>
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specialistFrontier.map(model => (
              <ModelCard
                key={model.name}
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
        <SectionTab sectionId="other-models">Other Models</SectionTab>
        <Heading align="between">
          <HeadingTitle as="h3">Other Models</HeadingTitle>
          <HeadingSubtitle className="text-secondary-foreground/85">
            Other supported models available.
          </HeadingSubtitle>
        </Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {otherModels.map(model => (
            <ModelCard
              key={model.name}
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
          Legacy/Deprecated
        </SectionTab>
        <Heading align="between">
          <HeadingTitle as="h3" className="text-2xl 2xl:text-3xl">
            Legacy Models
          </HeadingTitle>
          <HeadingSubtitle className="md:text-right text-secondary-foreground/85">
            Older models that have been deprecated or retired.
          </HeadingSubtitle>
        </Heading>
        <ModelTable data={legacyModels} forceDeprecated />
      </section>

    </div>
  );
}
