'use client';

import React from 'react';
import { ShieldIcon } from '@/components/icons/pixel';
import { useInterfaceSection } from './interface-section-provider';
import { TabsOpener } from './tabs-opener';

const INTERFACES = [
    {
        id: 'le-chat',
        title: 'Le Chat',
        logo: '/assets/logos/le-chat.svg',
        audience: 'Business users, analysts, content creators',
        audienceShort: 'Business & Creators',
        color: 'text-[#C4001D]',
        bgColor: 'bg-[#C4001D]/10',
        borderColor: 'border-[#C4001D]/20',
        hoverBorder: 'hover:border-[#C4001D]/50',
        activeBorder: 'border-[#C4001D]/50',
        description: 'Our collaborative AI workspace, the primary interface for anyone who wants to interact with AI without writing code.',
        href: 'https://chat.mistral.ai',
        ctaText: 'Go to Le Chat'
    },
    {
        id: 'studio',
        title: 'Studio',
        logo: '/assets/logos/studio.svg',
        audience: 'Developers, data scientists, AI engineers',
        audienceShort: 'Developers & Engineers',
        color: 'text-[#2563EB]',
        bgColor: 'bg-[#2563EB]/10',
        borderColor: 'border-[#2563EB]/20',
        hoverBorder: 'hover:border-[#2563EB]/50',
        activeBorder: 'border-[#2563EB]/50',
        description: 'The developer console. It provides everything you need to build, test, and optimize AI applications on the Mistral API.',
        href: 'https://console.mistral.ai',
        ctaText: 'Try Studio'
    },
    {
        id: 'mistral-vibe',
        title: 'Mistral Vibe',
        logo: '/assets/logos/mistral-vibe.png',
        audience: 'Developers, engineers, terminal power users',
        audienceShort: 'Developers & Engineers',
        color: 'text-[#7C3AED]',
        bgColor: 'bg-[#7C3AED]/10',
        borderColor: 'border-[#7C3AED]/20',
        hoverBorder: 'hover:border-[#7C3AED]/50',
        activeBorder: 'border-[#7C3AED]/50',
        description: 'The open-source, terminal-native coding agent powered by Devstral. Scan files, maintain multi-file context, and execute commands from your terminal.',
        href: 'https://github.com/mistralai/mistral-vibe',
        ctaText: 'Try Vibe'
    },
    {
        id: 'admin',
        title: 'Admin',
        icon: ShieldIcon,
        audience: 'IT admins, billing managers, organization owners',
        audienceShort: 'IT & Operations',
        color: 'text-[#FF8205]',
        bgColor: 'bg-[#FF8205]/10',
        borderColor: 'border-[#FF8205]/20',
        hoverBorder: 'hover:border-[#FF8205]/50',
        activeBorder: 'border-[#FF8205]/50',
        description: "The control plane. It manages your organization's account, team structure, billing, and security policies.",
        href: 'https://admin.mistral.ai',
        ctaText: 'Go to Admin'
    }
];

export function InterfaceCards() {
    const [activeId, setActiveId] = React.useState<string | null>(null);
    const { scrollToSection } = useInterfaceSection();

    const handleChange = React.useCallback((id: string) => {
        setActiveId(prev => (prev === id ? null : id));
        scrollToSection(id);
    }, [scrollToSection]);

    return (
        <div className="my-8 w-full">
            <TabsOpener
                options={INTERFACES}
                activeId={activeId}
                onChange={handleChange}
                layoutIdPrefix="interface-cards"
            />
        </div>
    );
}
