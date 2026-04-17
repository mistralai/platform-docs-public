'use client';

import React, { useState, useMemo } from 'react';
import {
    SearchIcon, CancelIcon,
    ChatIcon, PenIcon, SmileIcon,
    KeyIcon, PointIcon, PickaxeIcon, StatsIcon, ComputerIcon,
    UserIcon, ShieldIcon, CalculatorIcon, FolderIcon, PageIcon
} from '@/components/icons/pixel';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.FC<any>> = {
    'message-square': ChatIcon,
    'pen-tool': PenIcon,
    'bot': SmileIcon,
    'search': SearchIcon,
    'key': KeyIcon,
    'mouse-pointer': PointIcon,
    'settings': PickaxeIcon,
    'activity': StatsIcon,
    'code': ComputerIcon,
    'users': UserIcon,
    'shield': ShieldIcon,
    'credit-card': CalculatorIcon,
    'briefcase': FolderIcon,
    'file-text': PageIcon
};

export type FeatureItem = {
    id: string;
    name: string;
    shortDescription: string;
    description: string;
    tags: string[];
    icon: string;
    interfaceType?: string;
};

export interface InteractiveFeatureTableProps {
    data: FeatureItem[];
    searchPlaceholder?: string;
    emptyStateMessage?: string;
}

export function InteractiveFeatureTable({
    data,
    searchPlaceholder = "Search features...",
    emptyStateMessage = "No features found matching"
}: InteractiveFeatureTableProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredFeatures = useMemo(() => {
        if (!searchQuery) return data;
        const lowerQuery = searchQuery.toLowerCase();

        return data.filter(feature => {
            const matchesName = feature.name.toLowerCase().includes(lowerQuery);
            const matchesShortDesc = feature.shortDescription.toLowerCase().includes(lowerQuery);
            const matchesDesc = feature.description.toLowerCase().includes(lowerQuery);
            const matchesTag = feature.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
            return matchesName || matchesShortDesc || matchesDesc || matchesTag;
        });
    }, [searchQuery, data]);

    return (
        <div className="flex flex-col gap-8 my-8 w-full">
            {/* Search Bar */}
            <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-11 w-full sm:max-w-[400px] bg-background shadow-xs transition-shadow hover:shadow-sm text-base"
                />
            </div>

            {/* Dynamic Card Grid matching Mistral Aesthetic */}
            {filteredFeatures.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center justify-center border border-dashed rounded-lg bg-muted/20">
                    <p className="text-muted-foreground mb-4">{emptyStateMessage} "<span className="font-semibold text-foreground">{searchQuery}</span>"</p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchQuery('')}
                        className="gap-2"
                    >
                        <CancelIcon className="h-4 w-4" />
                        Clear search
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
                    {filteredFeatures.map((feature) => {
                        const Icon = iconMap[feature.icon] || PickaxeIcon;

                        return (
                            <div
                                key={feature.id}
                                className={cn(
                                    "group relative flex flex-col bg-card overflow-hidden",
                                    "rounded-2xl border border-border/80 shadow-[0px_4px_16px_-6px_rgba(0,0,0,0.05)]",
                                    "transition-all duration-300 hover:border-primary/40 hover:shadow-lg"
                                )}
                            >
                                {/* Floating Top-Right Badge */}
                                <div className="absolute top-4 right-4 z-10">
                                    <Badge
                                        variant="outline"
                                        className="text-[10px] font-semibold uppercase tracking-wider bg-background/80 border-border/50 shadow-sm text-foreground/70 backdrop-blur-sm px-2 py-0.5 rounded-full"
                                    >
                                        {feature.interfaceType}
                                    </Badge>
                                </div>

                                {/* Main Card Content */}
                                <div className="flex flex-col p-6 flex-1 bg-white dark:bg-[#1a1816]/30">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-[var(--model-beige-subtle)]/60 dark:bg-primary/10 text-primary ring-1 ring-primary/10 transition-colors group-hover:bg-primary/10 group-hover:ring-primary/20">
                                            <Icon className="w-6 h-6 stroke-[1.5]" />
                                        </div>
                                        <div className="pt-1 pr-12">
                                            <h3 className="text-xl font-bold text-foreground tracking-tight mb-0.5">
                                                {feature.name}
                                            </h3>
                                            <p className="text-sm font-medium text-muted-foreground/90">
                                                {feature.shortDescription}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Rich Description */}
                                    <div className="mt-2 mb-6">
                                        <p className="text-sm text-foreground/80 leading-relaxed font-normal">
                                            {feature.description}
                                        </p>
                                    </div>

                                    {/* Muted warm tags */}
                                    <div className="flex flex-wrap items-center gap-1.5 mt-auto w-full pt-4 border-t border-border/40">
                                        {feature.tags.map(tag => (
                                            <Badge
                                                key={tag}
                                                variant="secondary"
                                                className="px-2 py-0.5 text-[11px] font-medium bg-[#f5f1ea] hover:bg-[#eadecc] text-foreground/80 dark:bg-[#2c2720] dark:hover:bg-[#38332a] dark:text-foreground/90 transition-colors border border-transparent shadow-none"
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
