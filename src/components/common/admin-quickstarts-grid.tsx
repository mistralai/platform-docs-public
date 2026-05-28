'use client';

import React from 'react';
import { ArrowRightIcon, ClockIcon } from '@/components/icons/pixel';
import { Link } from '@/i18n/navigation.client';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PRODUCT_LOGOS } from '@/schema/content/getting-started';
import { useLingo } from '@lingo.dev/react';

export function AdminQuickstartsGrid() {
    const l = useLingo();
    const activeData = {
        id: 'admin',
        title: 'Admin',
        logo: PRODUCT_LOGOS['admin'],
        activeBorder: 'hover:border-[#4a4a5e]/50',
        description: l.text('Choose a quickstart to begin. Each guide walks you through a key admin task.', { context: 'Intro text for admin quickstarts' }),
        quickstarts: [
            {
                title: l.text('Create your organization', { context: 'Quickstart title about create your organization quickstart (used as browser tab title and on' }),
                description: l.text('Set up billing, workspaces, and invite your first team members.', { context: 'Quickstart description about creating a Mistral organization' }),
                time: '15 min',
                href: '/getting-started/quickstarts/admin/create-organization',
            },
            {
                title: l.text('Configure SSO', { context: 'Quickstart title about configure SSO quickstart (used as browser tab title and on' }),
                description: l.text('Set up SAML Single Sign-On for enterprise authentication.', { context: 'Quickstart description about configuring SAML SSO' }),
                time: '15 min',
                href: '/getting-started/quickstarts/admin/configure-sso',
            },
            {
                title: l.text('Manage workspaces & API keys', { context: 'Quickstart title about managing workspaces and API keys' }),
                description: l.text('Create isolated workspaces, generate keys, and set usage limits.', { context: 'Quickstart description about managing workspaces and API keys' }),
                time: '10 min',
                href: '/getting-started/quickstarts/admin/manage-workspaces',
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
                                        <Image src={activeData.logo} alt={activeData.title} width={39} height={39} className="rounded-lg" />
                                    </div>
                                    <div className="shrink-0 flex items-center justify-center size-8 rounded-full bg-secondary text-secondary-foreground group-hover:bg-[#4a4a5e] group-hover:text-white transition-colors transition-transform duration-300 group-hover:scale-110">
                                        <ArrowRightIcon className="size-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                    </div>
                                </div>
                                <h3 className="font-bold text-xl tracking-tight leading-tight text-foreground group-hover:text-[#4a4a5e] transition-colors">
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
