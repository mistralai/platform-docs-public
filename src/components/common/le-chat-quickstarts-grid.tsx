'use client';

import React from 'react';
import { ArrowRightIcon, ClockIcon } from '@/components/icons/pixel';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PRODUCT_LOGOS } from '@/schema/content/getting-started';

const LE_CHAT_USER = {
    id: 'le-chat-user',
    title: 'Le Chat',
    logo: PRODUCT_LOGOS['le-chat'],
    color: 'text-[#C4001D]',
    bgColor: 'bg-[#C4001D]/10',
    borderColor: 'border-[#C4001D]/20',
    activeBorder: 'border-[#C4001D]/50',
    description: "Use Le Chat's collaborative AI workspace. No code required.",
    quickstarts: [
        {
            title: 'Web search, docs, and Canvas',
            description: 'Search the web, analyze a document, and edit results in Canvas.',
            time: '10 min',
            href: '/getting-started/quickstarts/le-chat/draft-research-report',
        },
        {
            title: 'Create and share a custom agent',
            description: 'Build a reusable agent with instructions, tools, and a knowledge base.',
            time: '10 min',
            href: '/getting-started/quickstarts/le-chat/create-custom-agent',
        },
        {
            title: 'Analyze data with Code Interpreter',
            description: 'Upload a spreadsheet and generate charts and insights.',
            time: '10 min',
            href: '/getting-started/quickstarts/le-chat/analyze-data',
        },
    ],
};

export function LeChatQuickstartsGrid() {
    const activeData = LE_CHAT_USER;

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
