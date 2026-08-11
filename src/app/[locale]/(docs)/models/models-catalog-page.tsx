import {
  Heading,
  HeadingSubtitle,
  HeadingTitle,
} from '@/components/layout/heading';
import { ModelCard } from '@/components/model/model-card';
import { SectionTab } from '@/components/layout/section-tab';
import { ModelTable } from '@/components/model/model-table';
import { models, nonLegacyModels } from '@/schema';
import type { Model } from '@/schema';
import {
  FEATURED_MODEL_NAMES_MODELS_PAGE,
  FEATURED_MODELS_COLOR_OVERRIDES,
} from '@/schema/content/models';
import { getLingo } from '@/i18n/server';
import { Link } from '@/i18n/navigation.client';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/i18n/config';
import type { Lingo } from '@lingo.dev/react';

export async function ModelsCatalogPage({
  params,
  introVariant = 'landing',
}: {
  params: Promise<{ locale: string }>;
  introVariant?: 'landing' | 'overview';
}) {
  const { locale } = (await params) as { locale: Locale };
  const l = await getLingo(locale);
  const featuredModels = FEATURED_MODEL_NAMES_MODELS_PAGE.map(
    slug => models.find(model => model.slug === slug)!
  ).filter(Boolean);

  const legacySlugs = models
    .filter(model => model.status === 'Deprecated' || model.status === 'Retired')
    .sort((a, b) => {
      const dateA = modelDate(a);
      const dateB = modelDate(b);
      return dateB.localeCompare(dateA);
    })
    .map(model => model.slug);
  const modelGroups = getModelGroups(nonLegacyModels);

  return (
    <div className="mx-auto space-y-14 w-full md:pt-8 not-prose">
      <div className="space-y-4">
        <Heading align="center">
          <HeadingTitle as="h1">
            {l.text('Models Overview', { context: 'Main heading for the page listing all AI models' })}
          </HeadingTitle>
          <HeadingSubtitle>
            {introVariant === 'overview'
              ? l.text('A list of all available models, helping you explore their capabilities, performance, trade-offs, and more.', { context: 'Introductory description of the AI model catalog' })
              : l.text('Mistral develops, or makes available, open-weight and commercial large language models. Explore the full lineup, compare benchmarks, and find the right model for your use case.', { context: 'Introductory description of Mistral AI models' })}
          </HeadingSubtitle>
        </Heading>
      </div>

      <div className="flex justify-center">
        <div className="flex flex-col sm:flex-row items-center gap-4 rounded-xl border bg-card px-6 py-5 text-center sm:text-left">
          <div>
            <p className="font-semibold text-foreground">
              {l.text('Compare model capabilities', { context: 'CTA heading for model comparison on models page' })}
            </p>
            <p className="text-sm text-muted-foreground">
              {l.text('Use the model selection guide to match models to your task, latency, and cost targets.', { context: 'CTA description for model comparison on models page' })}
            </p>
          </div>
          <Button size="lg" asChild>
            <Link href="/inference/model-selection-guide">{l.text('Compare models', { context: 'CTA label linking to model selection guide' })}</Link>
          </Button>
        </div>
      </div>

      <section id="featured-models" className="flex flex-col gap-6">
        <SectionTab sectionId="featured-models">
          {l.text('Featured Models', { context: 'Heading for featured AI models' })}
        </SectionTab>

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

      <section id="all-models" className="flex flex-col gap-8">
        <div className="space-y-3">
          <SectionTab sectionId="all-models">
            {locale === 'fr'
              ? 'Tous les modèles'
              : l.text('All models', { context: 'Heading for the full list of currently available AI models' })}
          </SectionTab>
          <p className="text-muted-foreground text-base leading-relaxed max-w-3xl">
            {l.text('A list of all available models, helping you explore their capabilities, performance, trade-offs, and more.', { context: 'Introductory description of the AI model catalog' })}
          </p>
        </div>

        {modelGroups.map(group => (
          <section key={group.id} id={group.id} className="flex flex-col gap-4">
            <div className="space-y-3">
              <SectionTab variant="secondary" sectionId={group.id}>
                {getModelGroupTitle(group.title, l)}
              </SectionTab>
              <p className="text-muted-foreground text-base leading-relaxed max-w-3xl">
                {getModelGroupDescription(group.description, l)}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.models.map(model => (
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
        ))}
      </section>

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

function modelDate(model: Model): string {
  return model.metadata?.deprecationDate ?? model.metadata?.retirementDate ?? '';
}

type ModelGroup = {
  id: string;
  title: ModelGroupTitle;
  description: ModelGroupDescription;
  models: Model[];
};

type ModelGroupTitle =
  | 'Generalist models'
  | 'OCR models'
  | 'Audio models'
  | 'Code models'
  | 'Embedding models'
  | 'Moderation and safety models'
  | 'Other specialist models';

type ModelGroupDescription =
  | 'Text and multimodal models for broad reasoning, coding, tool use, and agentic tasks.'
  | 'Models for document understanding, text extraction, and structured OCR outputs.'
  | 'Models for speech transcription, realtime transcription, and speech generation.'
  | 'Specialized models for code generation, completion, and software engineering agents.'
  | 'Models that turn text or code into vectors for retrieval and similarity search.'
  | 'Models for safety filtering, moderation, and policy checks.'
  | 'Specialized models for focused domains and task-specific workloads.';

function getModelGroups(items: Model[]): ModelGroup[] {
  const generalist = items.filter(model => model.class === 'Generalist');
  const specialists = items.filter(model => model.class === 'Specialist');
  const bySlug = (slugs: string[]) =>
    specialists.filter(model => slugs.includes(model.slug as string));
  const explicitSpecialistSlugs = new Set<string>();
  const specialistGroup = (
    id: string,
    title: ModelGroupTitle,
    description: ModelGroupDescription,
    slugs: string[]
  ): ModelGroup => {
    for (const slug of slugs) explicitSpecialistSlugs.add(slug);
    return {
      id,
      title,
      description,
      models: bySlug(slugs),
    };
  };

  const groups: ModelGroup[] = [
    {
      id: 'generalist-models',
      title: 'Generalist models',
      description: 'Text and multimodal models for broad reasoning, coding, tool use, and agentic tasks.',
      models: generalist,
    },
    specialistGroup(
      'ocr-models',
      'OCR models',
      'Models for document understanding, text extraction, and structured OCR outputs.',
      ['ocr-4-0', 'ocr-3-25-12', 'ocr-2-25-05', 'ocr-25-03']
    ),
    specialistGroup(
      'audio-models',
      'Audio models',
      'Models for speech transcription, realtime transcription, and speech generation.',
      ['voxtral-mini-transcribe-26-02', 'voxtral-mini-transcribe-realtime-26-02', 'voxtral-tts-26-03', 'voxtral-small-25-07', 'voxtral-mini-25-07', 'voxtral-mini-transcribe-25-07']
    ),
    specialistGroup(
      'code-models',
      'Code models',
      'Specialized models for code generation, completion, and software engineering agents.',
      ['codestral-25-08', 'codestral-25-01', 'codestral-24-05', 'codestral-mamba-7b-0-1']
    ),
    specialistGroup(
      'embedding-models',
      'Embedding models',
      'Models that turn text or code into vectors for retrieval and similarity search.',
      ['codestral-embed-25-05', 'mistral-embed-23-12']
    ),
    specialistGroup(
      'moderation-safety-models',
      'Moderation and safety models',
      'Models for safety filtering, moderation, and policy checks.',
      ['mistral-moderation-26-03', 'mistral-moderation-24-11', 'shieldstral-1-0']
    ),
  ];

  const otherSpecialists = specialists.filter(
    model => !explicitSpecialistSlugs.has(model.slug as string)
  );
  if (otherSpecialists.length > 0) {
    groups.push({
      id: 'other-specialist-models',
      title: 'Other specialist models',
      description: 'Specialized models for focused domains and task-specific workloads.',
      models: otherSpecialists,
    });
  }

  return groups.filter(group => group.models.length > 0);
}

function getModelGroupTitle(title: ModelGroupTitle, l: Lingo): string {
  switch (title) {
    case 'Generalist models':
      return l.text('Generalist models', { context: 'Heading for generalist AI models' });
    case 'OCR models':
      return l.text('OCR models', { context: 'Heading for OCR model family' });
    case 'Audio models':
      return l.text('Audio models', { context: 'Heading for audio model family' });
    case 'Code models':
      return l.text('Code models', { context: 'Heading for code model family' });
    case 'Embedding models':
      return l.text('Embedding models', { context: 'Heading for embedding model family' });
    case 'Moderation and safety models':
      return l.text('Moderation and safety models', { context: 'Heading for moderation and safety model family' });
    case 'Other specialist models':
      return l.text('Other specialist models', { context: 'Heading for other specialist model family' });
  }
}

function getModelGroupDescription(description: ModelGroupDescription, l: Lingo): string {
  switch (description) {
    case 'Text and multimodal models for broad reasoning, coding, tool use, and agentic tasks.':
      return l.text('Text and multimodal models for broad reasoning, coding, tool use, and agentic tasks.', { context: 'Description for generalist AI model group' });
    case 'Models for document understanding, text extraction, and structured OCR outputs.':
      return l.text('Models for document understanding, text extraction, and structured OCR outputs.', { context: 'Description for OCR model group' });
    case 'Models for speech transcription, realtime transcription, and speech generation.':
      return l.text('Models for speech transcription, realtime transcription, and speech generation.', { context: 'Description for audio model group' });
    case 'Specialized models for code generation, completion, and software engineering agents.':
      return l.text('Specialized models for code generation, completion, and software engineering agents.', { context: 'Description for code model group' });
    case 'Models that turn text or code into vectors for retrieval and similarity search.':
      return l.text('Models that turn text or code into vectors for retrieval and similarity search.', { context: 'Description for embedding model group' });
    case 'Models for safety filtering, moderation, and policy checks.':
      return l.text('Models for safety filtering, moderation, and policy checks.', { context: 'Description for moderation and safety model group' });
    case 'Specialized models for focused domains and task-specific workloads.':
      return l.text('Specialized models for focused domains and task-specific workloads.', { context: 'Description for other specialist model group' });
  }
}
