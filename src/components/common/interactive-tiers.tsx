'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon, ChatIcon, ThunderIcon, UserIcon, HomeIcon, LaptopIcon, EarthIcon, ArrowRightIcon, ShieldIcon } from '@/components/icons/pixel';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const VIBE_PLANS = [
    {
        id: 'free',
        title: 'Free',
        price: 'Free',
        audience: 'Individuals exploring AI',
        icon: ChatIcon,
        color: 'text-zinc-500',
        bgColor: 'bg-zinc-500/10',
        borderColor: 'border-zinc-500/20',
        activeBorder: 'border-zinc-500/50',
        description: 'Basic access to chat features and standard rate limits.',
        features: ['Mistral Small', '500 Memories', 'Generate pictures'],
        details: [
            { label: 'Models', value: 'Access to Mistral\’s SOTA AI models including Mistral Small.' },
            { label: 'Chat & Search', value: 'Chat, search, learn, create with Mistral Vibe.' },
            { label: 'Memory', value: 'Save and recall up to 500 memories.' },
            { label: 'Image Gen', value: 'State-of-the-art image generation.' },
            { label: 'Organization', value: 'Group chats into projects.' },
        ],
    },
    {
        id: 'pro',
        title: 'Pro',
        price: 'Pro',
        audience: 'Professionals and power users',
        icon: ThunderIcon,
        color: 'text-[#FF8205]',
        bgColor: 'bg-[#FF8205]/10',
        borderColor: 'border-[#FF8205]/30',
        activeBorder: 'border-[#FF8205]/50',
        description: 'Higher limits, deep research, and IDE integration.',
        features: ['All Models (inc. Large)', 'Deep Research', 'Mistral Vibe IDE'],
        popular: true,
        details: [
            { label: 'Models', value: 'All top-tier models including Mistral Large.' },
            { label: 'Deep Research', value: 'Extended thinking and automated research reports.' },
            { label: 'Storage', value: 'Up to 15GB of document storage & 1,000 projects.' },
            { label: 'Developer', value: 'Mistral Vibe for all-day coding, PAYG beyond.' },
            { label: 'Support', value: 'Chat and email support.' },
        ],
    },
    {
        id: 'team',
        title: 'Team',
        price: 'Team',
        audience: 'Collaborative teams and startups',
        icon: UserIcon,
        color: 'text-[#FF8205]',
        bgColor: 'bg-[#FF8205]/10',
        borderColor: 'border-[#FF8205]/30',
        activeBorder: 'border-[#FF8205]/50',
        description: 'Secure, collaborative workspace building with AI.',
        features: ['30GB storage/user', 'Domain verification'],
        details: [
            { label: 'Storage', value: 'Up to 30GB of secure storage per user.' },
            { label: 'Security', value: 'Domain name verification & Data export controls.' },
            { label: 'Collaboration', value: 'Secure workspace meant for team ideation.' },
        ],
    },
    {
        id: 'enterprise',
        title: 'Enterprise',
        price: 'Custom',
        audience: 'Organizations requiring governance',
        icon: HomeIcon,
        color: 'text-[#FF8205]',
        bgColor: 'bg-[#FF8205]/10',
        borderColor: 'border-[#FF8205]/20',
        activeBorder: 'border-[#FF8205]/50',
        description: 'Private deployments, custom models, and full control.',
        features: ['Custom Deployments', 'SAML SSO', 'White Labeling'],
        details: [
            { label: 'Deployments', value: 'Private deployments powered by custom models, UI, and tools.' },
            { label: 'Security', value: 'SAML SSO, Audit logs, Admin API.' },
            { label: 'Customization', value: 'White labeling and dedicated infrastructure.' },
            { label: 'Support', value: 'Dedicated customer success manager & SLAs.' },
        ],
    }
];

const API_FEATURES = [
    { feature: 'Cost Model', experiment: 'Pay-as-you-go (per token)', scale: 'Flat-fee monthly commitment' },
    { feature: 'Infrastructure', experiment: 'Shared capacity', scale: 'Dedicated capacity' },
    { feature: 'Latency', experiment: 'Best effort (traffic dependent)', scale: 'Predictable & Guaranteed SLAs' },
    { feature: 'Rate Limits', experiment: 'Standard tier limits', scale: 'Custom throughput based on commit' },
    { feature: 'Deployments', experiment: 'Studio SaaS', scale: 'Studio, Cloud VPC' },
    { feature: 'Support', experiment: 'Community & Email', scale: 'Dedicated Success Manager' },
    { feature: 'Custom Fine-Tuning', experiment: 'Self-serve (LoRA)', scale: 'Full weights, specialized base models' },
];

export function InteractiveTiers() {
    const [selectedVibe, setSelectedVibe] = useState(VIBE_PLANS[1].id);
    const activeVibeData = VIBE_PLANS.find(p => p.id === selectedVibe);

    return (
        <div className="flex flex-col gap-8 my-8 w-full">
            {/* Vibe Plans */}
            <div>
                <div className="mb-6 flex items-center justify-between gap-4">
                    <p className="text-muted-foreground m-0 max-w-2xl">
                        Select a plan below to view its technical details and capabilities. These plans govern access to the <strong className="text-foreground">chat.mistral.ai</strong> visual workspace.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {VIBE_PLANS.map((plan) => {
                        const Icon = plan.icon;
                        const isActive = selectedVibe === plan.id;
                        return (
                            <button
                                key={plan.id}
                                onClick={() => setSelectedVibe(plan.id)}
                                className={cn(
                                    "group relative flex flex-col items-start overflow-hidden rounded-xl border text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                    isActive
                                        ? `bg-card border-border shadow-md ring-1 ring-border`
                                        : 'bg-transparent border-transparent hover:bg-card/50 hover:border-border/50 hover:shadow-sm'
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="active-vibe-bg"
                                        className="absolute inset-0 bg-gradient-to-br from-card to-card opacity-50 z-0"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}

                                <div className="relative z-10 flex flex-col gap-3 p-5 h-full w-full">
                                    <div className="flex items-start justify-between">
                                        <div className={cn("p-2 rounded-lg transition-colors", isActive ? plan.bgColor : 'bg-muted')}>
                                            <Icon className={cn("size-5", isActive ? plan.color : 'text-muted-foreground')} />
                                        </div>
                                        {plan.popular && (
                                            <Badge variant="default" className="text-[10px] px-1.5 py-0 shadow-sm border-0">Popular</Badge>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className={cn("text-lg font-bold tracking-tight", isActive ? 'text-foreground' : 'text-foreground/80')}>
                                            {plan.title}
                                        </h3>
                                        <div className={cn("font-medium text-sm mt-0.5", isActive ? plan.color : 'text-muted-foreground')}>
                                            {plan.price}
                                        </div>
                                    </div>

                                    <p className="text-muted-foreground text-xs leading-relaxed mt-1 flex-1">
                                        {plan.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Selected Vibe Details Below */}
                <div className="mt-6 relative min-h-[160px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedVibe}
                            initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="w-full"
                        >
                            {activeVibeData && (
                                <div className={cn("p-6 rounded-xl border bg-card shadow-sm", activeVibeData.activeBorder)}>
                                    <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn('p-2 rounded-lg', activeVibeData.bgColor)}>
                                                <activeVibeData.icon className={cn('size-6', activeVibeData.color)} />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold tracking-tight m-0">{activeVibeData.title} Details</h4>
                                                <p className="text-sm font-medium m-0 text-muted-foreground">Built for: {activeVibeData.audience}</p>
                                            </div>
                                        </div>
                                        <Link
                                            href={
                                                activeVibeData.id === 'enterprise'
                                                    ? 'https://mistral.ai/contact'
                                                    : activeVibeData.id === 'free'
                                                        ? 'https://v2.auth.mistral.ai/login'
                                                        : 'https://chat.mistral.ai/upgrade/plans'
                                            }
                                            target="_blank"
                                            className={cn(
                                                "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none h-9 px-4 py-2 no-underline hover:no-underline",
                                                "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                                            )}
                                        >
                                            {activeVibeData.id === 'enterprise'
                                                ? 'Contact Sales'
                                                : activeVibeData.id === 'free'
                                                    ? 'Get started for free'
                                                    : 'Upgrade to ' + activeVibeData.title}
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {activeVibeData.details.map((detail, idx) => (
                                            <div key={idx}>
                                                <div className="text-sm font-semibold text-foreground mb-1">{detail.label}</div>
                                                <div className="text-sm text-muted-foreground leading-relaxed">{detail.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* API Plans Comparison */}
            <div className="pt-8 border-t border-border">
                <div className="mb-6">
                    <h3 className="text-2xl font-bold tracking-tight mb-2">API Plans</h3>
                    <p className="text-muted-foreground m-0 max-w-2xl">
                        API plans govern programmatic access to Mistral models via <code>api.mistral.ai</code>. They are separate from your Le Chat subscription. Compare the <strong className="text-foreground">Experiment</strong> and <strong className="text-foreground">Scale</strong> tiers in the table below.
                    </p>
                </div>

                <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[30%] text-foreground font-semibold">Technical Aspect</TableHead>
                                <TableHead className="w-[35%] py-4">
                                    <div className="flex items-center gap-2">
                                        <EarthIcon className="size-4 text-[#FF8205]" />
                                        <span className="text-foreground font-semibold text-base">Experiment</span>
                                    </div>
                                    <div className="text-xs font-normal text-muted-foreground mt-1">Pay-as-you-go prototyping</div>
                                </TableHead>
                                <TableHead className="w-[35%] py-4">
                                    <div className="flex items-center gap-2">
                                        <LaptopIcon className="size-4 text-[#FF8205]" />
                                        <span className="text-foreground font-semibold text-base">Scale</span>
                                    </div>
                                    <div className="text-xs font-normal text-muted-foreground mt-1">Committed production throughput</div>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {API_FEATURES.map((row, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-medium text-foreground">{row.feature}</TableCell>
                                    <TableCell className="text-muted-foreground">{row.experiment}</TableCell>
                                    <TableCell className="text-muted-foreground font-medium">{row.scale}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
