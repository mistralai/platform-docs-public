'use client';

import React from 'react';
import { ArrowRightIcon, ClockIcon } from '@/components/icons/pixel';
import { Link } from '@/i18n/navigation.client';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PRODUCT_LOGOS } from '@/schema/content/getting-started';
import { useLingo } from '@lingo.dev/react';

export function VibeCodeQuickstartsGrid() {
    const l = useLingo();
    const activeData = {
        id: 'vibe-code',
        title: 'Vibe Code',
        logo: PRODUCT_LOGOS['vibe-code'],
        activeBorder: 'hover:border-[#FA500F]/50',
        description: l.text("Vibe's coding mode: CLI, VS Code extension, or remote web sessions.", { context: 'Subtitle describing the Vibe Code mode' }),
        quickstarts: [
            {
                title: l.text('Install the Vibe CLI', { context: 'Quickstart title about installing the Vibe CLI' }),
                description: l.text('Install the CLI, configure your API key, and send your first prompt from the terminal.', { context: 'Quickstart description about installing the Vibe CLI' }),
                time: '5 min',
                href: '/getting-started/quickstarts/vibe-code/install-cli',
            },
            {
                title: l.text('Scaffold a project with Vibe Code', { context: 'Quickstart title about scaffolding a project with Vibe Code' }),
                description: l.text('Describe a project in natural language and let Vibe Code generate the files and structure.', { context: 'Quickstart description about scaffolding a project with Vibe Code' }),
                time: '10 min',
                href: '/getting-started/quickstarts/vibe-code/scaffold-a-project',
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
                                    <div className="shrink-0 flex items-center justify-center size-8 rounded-full bg-secondary text-secondary-foreground group-hover:bg-[#FA500F] group-hover:text-white transition-colors transition-transform duration-300 group-hover:scale-110">
                                        <ArrowRightIcon className="size-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                    </div>
                                </div>
                                <h3 className="font-bold text-xl tracking-tight leading-tight text-foreground group-hover:text-[#FA500F] transition-colors">
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
