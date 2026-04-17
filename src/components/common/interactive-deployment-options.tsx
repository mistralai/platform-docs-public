'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EarthIcon, LockIcon, CheckIcon, ChevronRightIcon } from '@/components/icons/pixel';
import { cn } from '@/lib/utils';

const DEPLOYMENT_OPTIONS = [
    {
        id: 'saas',
        title: 'SaaS (Studio)',
        icon: EarthIcon,
        color: 'text-[#FF8205]',
        bgColor: 'bg-[#FF8205]/10',
        borderColor: 'border-[#FF8205]/20',
        activeBorder: 'border-[#FF8205]/50',
        dataLocation: 'Mistral cloud',
        managedBy: 'Mistral AI',
        bestFor: 'Instant access, no infrastructure to manage',
        description: 'The fastest way to get started. Build with Mistral models hosted on our secure, highly-available infrastructure.',
        features: [
            'Zero setup required',
            'Automatic model updates',
            'Pay-as-you-go or committed throughput',
            'Global availability'
        ]
    },
    {
        id: 'vpc',
        title: 'Cloud private (VPC)',
        icon: LockIcon,
        color: 'text-[#FF8205]',
        bgColor: 'bg-[#FF8205]/10',
        borderColor: 'border-[#FF8205]/20',
        activeBorder: 'border-[#FF8205]/50',
        dataLocation: 'Your cloud account',
        managedBy: 'Cloud partner',
        bestFor: 'Data stays in your VPC; use existing cloud credits',
        description: 'Deploy Mistral models within your existing cloud account via certified partners like AWS, Azure, GCP, or IBM.',
        features: [
            'Data never leaves your VPC',
            'Burn down existing cloud commits',
            'Integrate with internal tools securely',
            'Managed by the cloud provider'
        ]
    },
];

export function InteractiveDeploymentOptions() {
    const [activeOption, setActiveOption] = useState(DEPLOYMENT_OPTIONS[0].id);

    const activeData = DEPLOYMENT_OPTIONS.find((o) => o.id === activeOption);

    return (
        <div className="flex flex-col gap-8 my-8 w-full">
            {/* Overview text */}
            <div className="text-muted-foreground text-lg max-w-2xl">
                Both deployment options expose a compatible REST API. Applications built against Studio can be pointed at a VPC instance with only a base URL change.
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Option Selector */}
                <div className="lg:col-span-5 flex flex-col gap-3">
                    {DEPLOYMENT_OPTIONS.map((option) => {
                        const isActive = activeOption === option.id;
                        const Icon = option.icon;
                        return (
                            <button
                                key={option.id}
                                onClick={() => setActiveOption(option.id)}
                                className={cn(
                                    'group flex flex-col items-start p-5 rounded-xl border text-left transition-all duration-300 w-full relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                                    isActive
                                        ? `bg-card border-border shadow-md ring-1 ring-border`
                                        : 'bg-transparent border-transparent hover:bg-card/50 hover:border-border/50 hover:shadow-sm'
                                )}
                            >
                                {/* Active Indicator Background Glow */}
                                {isActive && (
                                    <motion.div
                                        layoutId="active-nav-bg-deployment"
                                        className="absolute inset-0 bg-gradient-to-br from-card to-card opacity-50 z-0"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}

                                <div className="relative z-10 flex w-full items-center gap-4">
                                    <div
                                        className={cn(
                                            'p-2.5 rounded-lg transition-colors',
                                            isActive ? option.bgColor : 'bg-muted group-hover:bg-muted/80'
                                        )}
                                    >
                                        <Icon className={cn('size-6', isActive ? option.color : 'text-muted-foreground')} />
                                    </div>
                                    <div className="flex-1">
                                        <h3
                                            className={cn(
                                                'text-lg font-semibold transition-colors',
                                                isActive ? 'text-foreground' : 'text-foreground/80'
                                            )}
                                        >
                                            {option.title}
                                        </h3>
                                    </div>
                                    <ChevronRightIcon
                                        className={cn(
                                            'size-5 transition-transform duration-300',
                                            isActive ? 'text-foreground translate-x-1 opacity-100' : 'text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0'
                                        )}
                                    />
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Right Column: Dynamic Content */}
                <div className="lg:col-span-7 relative min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeOption}
                            initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="w-full"
                        >
                            {activeData && (
                                <div className="flex flex-col gap-6 p-1 h-full">
                                    <div className="mb-2">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={cn('p-1.5 rounded-md', activeData.bgColor)}>
                                                <activeData.icon className={cn('size-5', activeData.color)} />
                                            </div>
                                            <h2 className="text-2xl font-bold tracking-tight m-0">{activeData.title}</h2>
                                        </div>
                                        <p className="text-muted-foreground m-0">{activeData.description}</p>
                                    </div>

                                    <div className={cn('rounded-xl border bg-card p-6 shadow-sm', activeData.activeBorder)}>
                                        <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
                                            <div>
                                                <div className="text-sm font-medium text-muted-foreground mb-1">Data Location</div>
                                                <div className="font-semibold text-foreground">{activeData.dataLocation}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-muted-foreground mb-1">Managed By</div>
                                                <div className="font-semibold text-foreground">{activeData.managedBy}</div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="text-sm font-medium text-muted-foreground mb-1">Best For</div>
                                                <div className="font-semibold text-foreground">{activeData.bestFor}</div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-6 border-t border-border/50">
                                            {activeData.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-start gap-3">
                                                    <CheckIcon className={cn('size-5 shrink-0 mt-0.5', activeData.color)} />
                                                    <span className="text-muted-foreground font-medium">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
