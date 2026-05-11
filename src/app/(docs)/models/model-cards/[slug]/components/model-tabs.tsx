import Link from "next/link";
import * as React from "react";

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
import { FeatureItemWithList } from "./feature-item";
import { EndpointItem } from "./features-endpoint";
import { WeightsTable } from "./weights-table";

interface ModelTabsProps {
	model: Model;
}

export function ModelTabs({ model }: ModelTabsProps) {
	const { tabs, defaultValue } = React.useMemo(() => {
		const tabs = [];
		if (model.capabilities.features.length > 0) {
			tabs.push({ value: "features", label: "FEATURES" });
		}
		tabs.push({ value: "weights", label: "WEIGHTS" });

		return { tabs, defaultValue: tabs[0]?.value };
	}, [model]);



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
							key as keyof typeof AVAILABLE_FEATURES,
						);
						return (
							<FeatureItemWithList
								key={key}
								href={feature.link}
								as={Link}
								title={feature.name}
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
							Reach out to get access to{" "}
							<Link
								className="underline text-primary"
								href={`${MISTRAL_URL}/contact`}
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
