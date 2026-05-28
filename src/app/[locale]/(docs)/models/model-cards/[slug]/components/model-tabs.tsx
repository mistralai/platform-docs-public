import { Link } from '@/i18n/navigation.client';
import {
	Heading,
	HeadingSubtitle,
	HeadingTitle,
} from "@/components/layout/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {  MISTRAL_URL } from "@/lib/constants";
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

interface ModelTabsProps {
	model: Model;
	locale: Locale;
}

export async function ModelTabs({ model, locale }: ModelTabsProps) {
	const l = await getLingo(locale);
	const tabs: { value: string; label: string }[] = [];
	if (model.capabilities.features.length > 0) {
		tabs.push({ value: "features", label: l.text("FEATURES", { context: "Section heading for supported API features" }) });
	}
	tabs.push({ value: "weights", label: l.text("WEIGHTS", { context: "Section heading for downloadable model weights" }) });

	const defaultValue = tabs[0]?.value;

	if (!tabs.length) {
		return null;
	}

	const modelHasWeights = model.weights.length > 0;

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
					{Object.entries(AVAILABLE_FEATURES).map(([key, feature]) => {
						if (!feature) return null;

						const featureKey = key as keyof typeof AVAILABLE_FEATURES;
						const isSupported = model.capabilities.features.includes(featureKey);
						return (
							<FeatureItemWithList
								key={key}
								href={feature.link}
								as={Link}
								title={featureLabel(featureKey, l)}
								description={feature.link}
								icon={resolveIcon(
									AVAILABLE_ENDPOINTS[feature.endpoints[0] as EndpointKey].icon,
								)}
								disabled={!isSupported}
							>
								{feature.endpoints.map((endpoint) => (
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

			{/* Weights Tab */}
			{modelHasWeights ? (
				<TabsContent value="weights" className="mt-6">
					<Heading className="mb-6">
						<HeadingTitle as="h3" size="h4">
							{l.text("Weights", { context: "Heading for downloadable model weights" })}
						</HeadingTitle>
					</Heading>
					<WeightsTable weights={model.weights} />
				</TabsContent>
			) : (
				<TabsContent value="weights" className="mt-6">
					<Heading className="mb-6">
						<HeadingTitle as="h3" size="h4">
							{l.text("Contact Us", { context: "Heading for requesting access to model weights" })}
						</HeadingTitle>
						<HeadingSubtitle className="text-foreground/60">
							{l.text("Reach out to get access to", { context: "Prompt to contact Mistral for access to model weights" })}{" "}
							<Link
								className="underline text-primary"
								href={`${MISTRAL_URL}/contact`}
							>
								{l.text("{modelName} weights", {
									context: "Link text naming an AI model followed by \"weights\"",
									values: { modelName: model.name },
								})}
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
