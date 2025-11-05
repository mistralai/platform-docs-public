import * as React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { StatsIcon } from '@/components/icons/pixel';
import {
  Model,
  AVAILABLE_ENDPOINTS,
  AVAILABLE_FEATURES,
  AVAILABLE_FINETUNING,
  EndpointKey,
} from '@/schema/models';
import { resolveIcon } from '@/lib/icons';
import { FeatureItem, FeatureItemWithList } from './feature-item';
import { WeightsTable } from './weights-table';
import {
  Heading,
  HeadingSubtitle,
  HeadingTitle,
} from '@/components/layout/heading';
import { EndpointItem } from './features-endpoint';
import Link from 'next/link';
import { MISTRAL_CONTACT_URL } from '@/lib/constants';

interface ModelTabsProps {
  model: Model;
}

export function ModelTabs({ model }: ModelTabsProps) {
  const { tabs, defaultValue } = React.useMemo(() => {
    const tabs = [];
    if (model.capabilities.features.length > 0) {
      tabs.push({ value: 'features', label: 'FEATURES' });
    }
    if (model.capabilities.finetuning.length > 0) {
      tabs.push({ value: 'finetuning', label: 'FINETUNING' });
    }

    tabs.push({ value: 'weights', label: 'WEIGHTS' });

    return { tabs, defaultValue: tabs[0]?.value };
  }, [model]);

  const featureEndpoints = React.useMemo(() => {
    return new Set<string>(
      Object.entries(AVAILABLE_FEATURES).flatMap(([key, feature]) => {
        return feature.endpoints.map(endpoint => endpoint);
      })
    );
  }, []);

  if (!tabs.length) {
    return null;
  }

  const modelHasWeights = model.weights.length > 0;

  return (
    <Tabs defaultValue={defaultValue} className="w-full flex-1">
      <TabsList variant="secondary">
        {tabs.map(tab => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            variant="secondary"
            size="sm"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Endpoints Tab */}
      <TabsContent value="features" className="mt-6">
        <Heading className="mb-6">
          <HeadingTitle as="h3" size="h4">
            Features
          </HeadingTitle>
        </Heading>
        <FeaturesGrid>
          {Object.entries(AVAILABLE_FEATURES).map(([key, feature]) => {
            if (!feature) return null;

            const isSupported = model.capabilities.features.includes(
              key as keyof typeof AVAILABLE_FEATURES
            );
            return (
              <FeatureItemWithList
                key={key}
                href={feature.link}
                as={Link}
                title={feature.name}
                description={feature.link}
                icon={resolveIcon(
                  AVAILABLE_ENDPOINTS[feature.endpoints[0] as EndpointKey].icon
                )}
                disabled={!isSupported}
              >
                {feature.endpoints.map(endpoint => (
                  <EndpointItem
                    disabled={!isSupported}
                    key={endpoint}
                    value={AVAILABLE_ENDPOINTS[endpoint].path}
                  />
                ))}
              </FeatureItemWithList>
            );
          })}
        </FeaturesGrid>
      </TabsContent>

      {/* Finetuning Tab */}
      <TabsContent value="finetuning" className="mt-6">
        <Heading className="mb-6">
          <HeadingTitle as="h3" size="h4">
            Finetuning
          </HeadingTitle>
        </Heading>
        <FeaturesGrid>
          {Object.entries(AVAILABLE_FINETUNING).map(([key, finetuning]) => {
            const isSupported = model.capabilities.finetuning.includes(
              key as keyof typeof AVAILABLE_FINETUNING
            );

            // Determine capability based on input/output modalities
            const getCapabilityDescription = () => {
              if (!isSupported) return 'Not supported';

              // Map finetuning types to their corresponding modalities
              const getModalityForFinetuning = (finetuningKey: string) => {
                switch (finetuningKey) {
                  case 'text':
                    return 'text';
                  case 'vision':
                    return 'image';
                  case 'predicted-outputs':
                    return 'text'; // Predicted outputs is text-based
                  default:
                    return null;
                }
              };

              const modality = getModalityForFinetuning(key);
              if (!modality) return 'Not supported';

              const hasInput = model.capabilities.input.includes(
                modality as any
              );
              const hasOutput = model.capabilities.output.includes(
                modality as any
              );

              if (hasInput && hasOutput) return 'Input and output';
              if (hasInput) return 'Input only';
              if (hasOutput) return 'Output only';
              return 'Not supported';
            };

            return (
              <FeatureItem
                key={key}
                title={finetuning.name}
                description={getCapabilityDescription()}
                icon={StatsIcon}
                disabled={!isSupported}
              />
            );
          })}
        </FeaturesGrid>
      </TabsContent>

      {/* Weights Tab */}
      {modelHasWeights ? (
        <TabsContent value="weights" className="mt-6">
          <Heading className="mb-6">
            <HeadingTitle as="h3" size="h4">
              Weights
            </HeadingTitle>
          </Heading>
          <WeightsTable weights={model.weights} />
        </TabsContent>
      ) : (
        <TabsContent value="weights" className="mt-6">
          <Heading className="mb-6">
            <HeadingTitle as="h3" size="h4">
              Contact Us
            </HeadingTitle>
            <HeadingSubtitle className="text-foreground/60">
              Reach out to get access to{' '}
              <Link
                className="underline text-primary"
                href={MISTRAL_CONTACT_URL.toString()}
              >
                {model.name} weights
              </Link>
              .
            </HeadingSubtitle>
          </Heading>
        </TabsContent>
      )}
    </Tabs>
  );
}

const FeaturesGrid = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
      {children}
    </div>
  );
};
