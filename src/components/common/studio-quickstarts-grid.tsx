'use client';

import React from 'react';
import { ArrowRightIcon, ClockIcon } from '@/components/icons/pixel';
import { Link } from '@/i18n/navigation.client';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PRODUCT_LOGOS } from '@/schema/content/getting-started';
import { useLingo } from '@lingo.dev/react';

export function StudioQuickstartsGrid() {
    const l = useLingo();
    const activeData = {
        id: 'studio',
        title: 'Studio',
        logo: PRODUCT_LOGOS['studio'],
        activeBorder: 'hover:border-[#0082E6]/50',
        description: l.text('Build, test, and deploy AI applications with the Mistral API.', { context: 'Subtitle describing the Studio product' }),
        quickstarts: [
            {
                title: l.text('Activate Studio and generate an API key', { context: 'Quickstart title about activating Studio and generating an API key' }),
                description: l.text('Activate Studio in Free mode and generate your first API key.', { context: 'Quickstart description about activating Studio and generating an API key' }),
                time: '5 min',
                href: '/getting-started/quickstarts/studio/activate-and-generate-api-key',
            },
            {
                title: l.text('Test a model in the API playground', { context: 'Quickstart title about testing an AI model in the Studio playground' }),
                description: l.text('Send prompts, adjust parameters, and compare model outputs in the Studio playground.', { context: 'Quickstart description about testing an AI model in the Studio playground' }),
                time: '5 min',
                href: '/getting-started/quickstarts/studio/test-model-playground',
            },
        ],
    };

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
                        >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-transparent to-current" />

                            <div className="flex flex-col h-full gap-3 relative z-10">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="mb-2">
                                        <Image src={activeData.logo} alt={activeData.title} width={36} height={36} className="rounded-lg" />
                                    </div>
                                    <div className="shrink-0 flex items-center justify-center size-8 rounded-full bg-secondary text-secondary-foreground group-hover:bg-[#0082E6] group-hover:text-white transition-colors transition-transform duration-300 group-hover:scale-110">
                                        <ArrowRightIcon className="size-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                    </div>
                                </div>
                                <h3 className="font-bold text-xl tracking-tight leading-tight text-foreground group-hover:text-[#0082E6] transition-colors">
                                    {qs.title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed flex-1 mt-1">
                                    {qs.description}
                                </p>
                                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
                                    <ClockIcon className="size-3.5 text-muted-foreground/70" />
                                    <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
                                        {l.text('{time} to complete', { values: { time: qs.time }, context: 'Estimated time to finish a quickstart' })}
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
