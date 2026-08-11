import { Link } from '@/i18n/navigation.client';
import { SectionTab } from '@/components/layout/section-tab';
import Admonition from '@/components/common/admonition';
import {
	Heading,
	HeadingTitle,
} from "@/components/layout/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { resolveIcon } from "@/lib/icons";
import {
	AVAILABLE_ENDPOINTS,
	AVAILABLE_FEATURES,
	type EndpointKey,
	type Model,
} from "@/schema/models";
import { featureLabel } from "@/schema/models/i18n";
import { getLingo } from "@/i18n/server";
import { FeatureItemWithList } from "./feature-item";
import { EndpointItem } from "./features-endpoint";
import { WeightsTable } from "./weights-table";
import type { Locale } from "@/i18n/config";
import type { Lingo } from '@lingo.dev/react';

interface ModelTabsProps {
	model: Model;
	locale: Locale;
}

export async function ModelTabs({ model, locale }: ModelTabsProps) {
	const l = await getLingo(locale);
	const tabs: { value: string; label: string }[] = [];
	const supportedFeatures = model.capabilities.features;
	const modelHasWeights = model.weights.length > 0;

	if (supportedFeatures.length > 0) {
		tabs.push({ value: "features", label: l.text("FEATURES", { context: "Section heading for supported API features" }) });
	}
	if (modelHasWeights) {
		tabs.push({ value: "weights", label: l.text("WEIGHTS", { context: "Section heading for downloadable model weights" }) });
	}

	const defaultValue = tabs[0]?.value;

	if (!tabs.length) {
		return null;
	}

	return (
		<Tabs defaultValue={defaultValue} className="w-full flex-1">
			<TabsList variant="secondary">
				{tabs.map((tab) => (
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

			{/* Features Tab */}
			<TabsContent value="features" className="mt-6">
				<Heading className="mb-6">
					<HeadingTitle as="h3" size="h4">
						{l.text("Features", { context: "Heading for supported AI model features" })}
					</HeadingTitle>
				</Heading>
				<FeaturesGrid>
					{supportedFeatures.map((featureKey) => {
						const feature = AVAILABLE_FEATURES[featureKey];

						return (
							<FeatureItemWithList
								key={featureKey}
								href={feature.link}
								as={Link}
								title={featureLabel(featureKey, l)}
								description={feature.link}
								icon={resolveIcon(
									AVAILABLE_ENDPOINTS[feature.endpoints[0] as EndpointKey].icon,
								)}
							>
								{feature.endpoints.map((endpoint) => (
									<EndpointItem
										key={endpoint}
										value={AVAILABLE_ENDPOINTS[endpoint].path}
									/>
								))}
							</FeatureItemWithList>
						);
					})}
				</FeaturesGrid>
				{model.usageExample === 'zai-glm-5-2' && <ZaiGlmUsageExample l={l} />}
			</TabsContent>

			{/* Weights Tab */}
			{modelHasWeights && (
				<TabsContent value="weights" className="mt-6">
					<Heading className="mb-6">
						<HeadingTitle as="h3" size="h4">
							{l.text("Weights", { context: "Heading for downloadable model weights" })}
						</HeadingTitle>
					</Heading>
					<WeightsTable weights={model.weights} />
				</TabsContent>
			)}
		</Tabs>
	);
}

const ZaiGlmUsageExample = ({ l }: { l: Lingo }) => (
	<div className="mt-10 space-y-6">
		<SectionTab as="h2" variant="secondary" sectionId="regional-availability">
			{l.text('Regional availability', { context: 'Heading for a GLM 5.2 regional availability callout on the model card' })}
		</SectionTab>
		<Admonition type="info" title={l.text('Regional availability', { context: 'Heading for a GLM 5.2 regional availability callout on the model card' })} hideType>
			<p>
				{l.text('GLM 5.2 is available through the global endpoint and the EU regional endpoint. It is not available through the US regional endpoint yet.', { context: 'Regional availability note for GLM 5.2' })}{' '}
				{l.text('For details about regional endpoint behavior, see', { context: 'Intro text before the Regional Inference link on the GLM 5.2 model card' })}{' '}
				<Link href="/inference/regional-inference">
					{l.text('Regional Inference', { context: 'Link text to the Regional Inference documentation' })}
				</Link>
				.
			</p>
		</Admonition>
		<SectionTab as="h2" variant="secondary" sectionId="use-glm-5-2-with-curl">
			{l.text('Use GLM 5.2', { context: 'Heading for a GLM 5.2 curl onboarding example' })}
		</SectionTab>
		<p className="text-muted-foreground">
			{l.text('Send a request to the Chat Completions API with the `zai-glm-5-2` model name.', { context: 'Intro for a GLM 5.2 curl onboarding example' })}
		</p>
		<pre className="overflow-x-auto rounded-lg border border-border bg-card p-4 text-sm">
			<code>{`curl https://api.mistral.ai/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $MISTRAL_API_KEY" \\
  -d '{
    "model": "zai-glm-5-2",
    "messages": [
      {
        "role": "user",
        "content": "Summarize the main migration risks in this codebase."
      }
    ]
  }'`}</code>
		</pre>
	</div>
);

const FeaturesGrid = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
			{children}
		</div>
	);
};
