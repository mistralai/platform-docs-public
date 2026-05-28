'use client';

import React from 'react';
import { ArrowRightIcon, ClockIcon } from '@/components/icons/pixel';
import { Link } from '@/i18n/navigation.client';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PRODUCT_LOGOS } from '@/schema/content/getting-started';
import { useLingo } from '@lingo.dev/react';

export function DeveloperQuickstartsGrid() {
    const l = useLingo();
    const activeData = {
        id: 'developer',
        title: 'Developer',
        logo: PRODUCT_LOGOS['studio'],
        activeBorder: 'hover:border-[#0082E6]/50',
        description: l.text('Choose a quickstart to begin. We recommend starting with your first API request if you have not generated an API key yet.', { context: 'Intro text for developer quickstarts' }),
        quickstarts: [
            {
                title: l.text('Send your first API request', { context: 'Quickstart title about send your first API request quickstart (used as browser tab title and on' }),
                description: l.text('Install the SDK, set your API key, and get a model response.', { context: 'Quickstart description about sending the first API request' }),
                time: '5 min',
                href: '/getting-started/quickstarts/developer/first-api-request',
            },
            {
                title: l.text('Build an agent with tools', { context: 'Quickstart title about build an agent with tools quickstart (used as browser tab title and on' }),
                description: l.text('Define tools, let the model call functions, and return real-world data.', { context: 'Quickstart description about building an agent with tools' }),
                time: '10 min',
                href: '/getting-started/quickstarts/developer/build-an-agent',
            },
            {
                title: l.text('Set up RAG with document search', { context: 'Quickstart title about setting up RAG with document search' }),
                description: l.text('Upload documents and query them with retrieval-augmented generation.', { context: 'Quickstart description about setting up RAG with document search' }),
                time: '15 min',
                href: '/getting-started/quickstarts/developer/rag-document-search',
            },
            {
                title: l.text('Build a workflow', { context: 'Quickstart title about building a workflow' }),
                description: l.text('Scaffold a durable AI pipeline, run a worker, and trigger your first execution.', { context: 'Quickstart description about building a workflow' }),
                time: '15 min',
                href: '/getting-started/quickstarts/developer/build-a-workflow',
            },
        ],
    };

    return (
        <div className="flex flex-col gap-8 my-8 w-full not-prose">
            <div className="flex flex-col gap-6 w-full">
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
