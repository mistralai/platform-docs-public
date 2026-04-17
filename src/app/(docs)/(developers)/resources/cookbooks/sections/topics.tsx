'use client';

import { SectionTab } from '@/components/layout/section-tab';
import {
  Heading,
  HeadingSubtitle,
  HeadingTitle,
} from '@/components/layout/heading';
import { FeatureCard } from '@/components/common/feature-card';
import {
  featuredUseCases,
  featuredIntegrations,
} from '@/schema/cookbook/data-formatted';
import { useQueryState, parseAsString } from 'nuqs';
import {
  UserIcon,
  SearchIcon,
  CutIcon,
  EarthIcon,
  ComputerIcon,
  ScanIcon,
  PageIcon,
  GraphicsIcon,
  CalculatorIcon,
  ThunderIcon,
  FireIcon,
  PictureIcon,
} from '@/components/icons/pixel';

// Icon mapping for different use cases and integrations using pixel icons
const getUseCaseIcon = (useCase: string) => {
  const iconMap: Record<string, React.ElementType> = {
    Agents: UserIcon,
    RAG: SearchIcon,
    'Function calling': CutIcon,
    Vision: EarthIcon,
    Multimodal: ComputerIcon,
    OCR: ScanIcon,
    'Document QnA': PageIcon,
    'Structured Outputs': GraphicsIcon,
    Financial: CalculatorIcon,
    Quickstart: ThunderIcon,
    Search: SearchIcon,
    Pixtral: PictureIcon,
    Finetuning: FireIcon,
  };

  return iconMap[useCase] || PageIcon;
};

const getIntegrationIcon = (integration: string): React.ElementType => {
  const iconMap: Record<string, React.ElementType> = {
    Langfuse: GraphicsIcon,
    Azure: ComputerIcon,
    Neo4j: EarthIcon,
    Llamaindex: SearchIcon,
    Weaviate: ComputerIcon,
    Qdrant: FireIcon,
    AWS: ComputerIcon,
    'Google Cloud': ComputerIcon,
    Docker: UserIcon,
    GitHub: CutIcon,
  };

  return iconMap[integration] || <ComputerIcon className="size-8" />;
};

export default function CookbookTopicsSection() {
  // Use featured topics (already limited to 3 each)
  const displayUseCases = featuredUseCases;
  const displayIntegrations = featuredIntegrations;

  // Function to scroll to all cookbooks section and set filter
  const handleUseCaseClick = (useCase: string) => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete('integration');
    currentUrl.searchParams.set('useCase', useCase);
    window.history.pushState(null, '', currentUrl.toString());
    // Scroll to all cookbooks section
    document.getElementById('all-cookbooks')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  const handleIntegrationClick = (integration: string) => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete('useCase');
    currentUrl.searchParams.set('integration', integration);
    window.history.pushState(null, '', currentUrl.toString());

    // Scroll to all cookbooks section
    document.getElementById('all-cookbooks')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  return (
    <section id="topics" className="flex flex-col gap-6">
      <SectionTab sectionId='topics'>Topics</SectionTab>

      <Heading align="between">
        <HeadingTitle size="h3" as="h2">
          Explore by Topics
        </HeadingTitle>
        <HeadingSubtitle>
          Discover our cookbooks by use case
        </HeadingSubtitle>
      </Heading>

      {/* Use Cases */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {displayUseCases.map(useCase => (
          <FeatureCard
            as="button"
            key={useCase}
            title={useCase}
            description="Explore the Mistral AI APIs"
            icon={getUseCaseIcon(useCase)}
            variant="outline"
            interactive={true}
            className="cursor-pointer"
            onClick={() => handleUseCaseClick(useCase)}
          />
        ))}
        {displayIntegrations.map(integration => (
          <FeatureCard
            as="button"
            key={integration}
            title={integration}
            description="Explore the Mistral AI APIs"
            icon={getIntegrationIcon(integration)}
            variant="outline"
            interactive={true}
            className="cursor-pointer"
            onClick={() => handleIntegrationClick(integration)}
          />
        ))}
      </div>
    </section>
  );
}
