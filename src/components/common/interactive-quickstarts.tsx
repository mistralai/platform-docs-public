'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightIcon, ClockIcon } from '@/components/icons/pixel';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { PRODUCT_LOGOS } from '@/schema/content/getting-started';
import { TabsOpener } from './tabs-opener';

const ROLES = [
    {
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
    },
    {
        id: 'admin',
        title: 'Admin',
        logo: PRODUCT_LOGOS['admin'],
        color: 'text-[#FF8205]',
        bgColor: 'bg-[#FF8205]/10',
        borderColor: 'border-[#FF8205]/20',
        activeBorder: 'border-[#FF8205]/50',
        description: 'Set up and manage your Mistral organization and security.',
        quickstarts: [
            {
                title: 'Set up your organization',
                description: 'Create your org, activate billing, and invite team members.',
                time: '15 min',
                href: '/getting-started/quickstarts/admin/create-organization',
            },
            {
                title: 'Configure SSO & domain verification',
                description: 'Verify your domain and connect your corporate identity provider.',
                time: '20 min',
                href: '/getting-started/quickstarts/admin/configure-sso',
            },
            {
                title: 'Manage workspaces & API keys',
                description: 'Create isolated workspaces, generate keys, and set usage limits.',
                time: '10 min',
                href: '/getting-started/quickstarts/admin/manage-workspaces',
            },
        ],
    },
    {
        id: 'developer',
        title: 'Developer',
        logo: PRODUCT_LOGOS['developer'],
        color: 'text-[#FF8205]',
        bgColor: 'bg-[#FF8205]/10',
        borderColor: 'border-[#FF8205]/20',
        activeBorder: 'border-[#FF8205]/50',
        description: 'Build with the Mistral API, from your first request to agents and RAG.',
        quickstarts: [
            {
                title: 'Send your first API request',
                description: 'Install the SDK, set your API key, and get a model response.',
                time: '5 min',
                href: '/getting-started/quickstarts/developer/first-api-request',
            },
            {
                title: 'Build an agent with tools',
                description: 'Define tools, let the model call functions, and return real-world data.',
                time: '10 min',
                href: '/getting-started/quickstarts/developer/build-an-agent',
            },
            {
                title: 'Set up RAG with document search',
                description: 'Upload documents and query them with retrieval-augmented generation.',
                time: '10 min',
                href: '/getting-started/quickstarts/developer/rag-document-search',
            },
        ],
    },
];

export function InteractiveQuickstarts() {
    const [activeRole, setActiveRole] = useState(ROLES[0].id);

    const activeData = ROLES.find((r) => r.id === activeRole);

    return (
        <div className="flex flex-col gap-8 my-8 w-full">
            <div className="flex flex-col gap-8">
                {/* Top Row: Horizontal Role Selector */}
                <TabsOpener
                    options={ROLES}
                    activeId={activeRole}
                    onChange={setActiveRole}
                    layoutIdPrefix="interactive-quickstarts"
                />

                {/* Bottom Row: Dynamic Content Grid */}
                <div className="relative min-h-[300px] mt-2">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeRole}
                            initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
                            transition={{ duration: 0.01, ease: 'easeOut' }}
                            className="w-full"
                        >
                            {activeData && (
                                <div className="flex flex-col gap-6 p-1">
                                    <div className="mb-2 text-center md:text-left">
                                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                            <Image src={activeData.logo} alt={activeData.title} width={28} height={28} className="rounded-md" />
                                            <h2 className="text-2xl font-bold tracking-tight m-0 text-secondary-foreground">{activeData.title}</h2>
                                        </div>
                                        <p className="text-muted-foreground m-0">{activeData.description}</p>
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
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
