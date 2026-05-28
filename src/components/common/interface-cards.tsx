'use client';

import React from 'react';
import { useLingo } from '@lingo.dev/react';
import { useInterfaceSection } from './interface-section-provider';
import { TabsOpener } from './tabs-opener';

export function InterfaceCards() {
    const l = useLingo();
    const INTERFACES = [
        {
            id: 'vibe',
            title: 'Vibe',
            logo: '/assets/logos/vibe.svg',
            audience: l.text('All users: chat in the web app, code in the terminal or editor', { context: 'Intended audience for the Vibe product' }),
            audienceShort: l.text('Everyone', { context: 'Short audience label for the Vibe product' }),
            color: 'text-[#FA500F]',
            bgColor: 'bg-[#FA500F]/10',
            borderColor: 'border-[#FA500F]/20',
            hoverBorder: 'hover:border-[#FA500F]/50',
            hoverText: 'group-hover:text-[#FA500F]',
            activeBorder: 'border-[#FA500F]/50',
            description: l.text("Mistral's unified agent. Work mode for chat-driven productivity, Code mode for the terminal and editor, Chat mode for quick conversations.", { context: 'Description of the Vibe product' }),
            href: 'https://chat.mistral.ai',
            ctaText: l.text('Open Vibe', { context: 'Call to open Vibe' }),
        },
        {
            id: 'studio',
            title: 'Studio',
            logo: '/assets/logos/studio.svg',
            audience: l.text('Developers, data scientists, AI engineers', { context: 'Intended audience for the Studio product' }),
            audienceShort: l.text('Developers & Engineers', { context: 'Short audience label for developer-focused products' }),
            color: 'text-[#0082E6]',
            bgColor: 'bg-[#0082E6]/10',
            borderColor: 'border-[#0082E6]/20',
            hoverBorder: 'hover:border-[#0082E6]/50',
            hoverText: 'group-hover:text-[#0082E6]',
            activeBorder: 'border-[#0082E6]/50',
            description: l.text('The developer console. It provides everything you need to build, test, and optimize AI applications on the Mistral API.', { context: 'Description of the Studio product' }),
            href: 'https://console.mistral.ai',
            ctaText: l.text('Try Studio', { context: 'Call to open Studio' }),
        },
        {
            id: 'admin',
            title: l.text('Admin', { context: 'Name of the Mistral admin console' }),
            logo: '/assets/logos/admin.svg',
            audience: l.text('IT admins, billing managers, organization owners', { context: 'Intended audience for the admin console' }),
            audienceShort: l.text('IT & Operations', { context: 'Short audience label for the admin console' }),
            color: 'text-[#4a4a5e]',
            bgColor: 'bg-[#4a4a5e]/10',
            borderColor: 'border-[#4a4a5e]/20',
            hoverBorder: 'hover:border-[#4a4a5e]/50',
            hoverText: 'group-hover:text-[#4a4a5e]',
            activeBorder: 'border-[#4a4a5e]/50',
            description: l.text("The control plane. It manages your organization's account, team structure, billing, and security policies.", { context: 'Description of the admin console' }),
            href: 'https://admin.mistral.ai',
            ctaText: l.text('Go to Admin', { context: 'Call to open the admin console' }),
        }
    ];
    const { scrollToSection } = useInterfaceSection();

    return (
        <div className="my-8 w-full not-prose">
            <TabsOpener options={INTERFACES} onChange={scrollToSection} />
        </div>
    );
}
