'use client';

import React from 'react';
import { ArrowRightIcon, ClockIcon } from '@/components/icons/pixel';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PRODUCT_LOGOS } from '@/schema/content/getting-started';

const VIBE_DATA = {
    id: 'vibe',
    title: 'Mistral Vibe',
    logo: PRODUCT_LOGOS['mistral-vibe'],
    color: 'text-[#7C3AED]',
    bgColor: 'bg-[#7C3AED]/10',
    borderColor: 'border-[#7C3AED]/20',
    activeBorder: 'border-[#7C3AED]/50',
    description: 'Generate code, edit files, and automate tasks from your terminal.',
    quickstarts: [
        {
            title: 'Install Mistral Vibe and send your first prompt',
            description: 'Install Mistral Vibe, configure your API key, and send your first prompt from the terminal.',
            time: '5 min',
            href: '/getting-started/quickstarts/vibe/install-and-first-prompt',
        },
        {
            title: 'Scaffold a project with Mistral Vibe',
            description: 'Describe a project in natural language and let Mistral Vibe generate the files and structure.',
            time: '10 min',
            href: '/getting-started/quickstarts/vibe/scaffold-a-project',
        },
    ],
};

export function VibeQuickstartsGrid() {
    const activeData = VIBE_DATA;

    return (
        <div className="flex flex-col gap-8 my-8 w-full not-prose">
            <div className="flex flex-col gap-6 w-full">
                <div className="mb-2 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                        <Image src={activeData.logo} alt={activeData.title} width={28} height={28} className="rounded-md" />
                        <h2 className="text-2xl font-bold tracking-tight m-0 text-secondary-foreground">{activeData.title}</h2>
                    </div>
                    <p className="text-muted-foreground text-base m-0">{activeData.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {activeData.quickstarts.map((qs, i) => (
                        <Link
                            key={i}
                            href={qs.href}
                            className={cn(
                                'group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col no-underline hover:no-underline',
                                activeData.activeBorder
                            )}
                            style={{
                                boxShadow: '0 4px 20px -10px rgba(0,0,0,0.1)'
                            }}
                        >
                            {/* Hover glow effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-transparent to-current" />

                            <div className="flex flex-col h-full gap-3 relative z-10">
                                <div className="flex items-start justify-between gap-4">
                                    <h3 className="font-semibold text-[1.1rem] leading-tight text-foreground group-hover:text-primary transition-colors">
                                        {qs.title}
                                    </h3>
                                    <div className="shrink-0 flex items-center justify-center size-8 rounded-full bg-secondary text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors transition-transform duration-300 group-hover:scale-110">
                                        <ArrowRightIcon className="size-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                    </div>
                                </div>

                                <p className="text-muted-foreground text-sm leading-relaxed flex-1 mt-1">
                                    {qs.description}
                                </p>

                                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
                                    <ClockIcon className="size-3.5 text-muted-foreground/70" />
                                    <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
                                        {qs.time} to complete
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
