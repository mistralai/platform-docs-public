'use client';

import { Link } from '@/i18n/navigation.client';
import { ArrowRightIcon } from '@/components/icons/pixel';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PixelGrid } from '@/components/common/pixel-grid';
import { PRODUCT_COLORS, PRODUCT_LOGOS } from '@/schema/content/getting-started';
import { useLingo } from '@lingo.dev/react';

export function QuickstartDocLinks() {
  const l = useLingo();
  const DOC_LINKS = [
    {
      title: l.text('Vibe documentation', { context: 'Title of the Vibe documentation link on the quickstart doc-links row' }),
      description: l.text('Productivity in Work, coding in Code, legacy features in Chat.', { context: 'Description of the Vibe documentation link on the quickstart doc-links row' }),
      logo: PRODUCT_LOGOS['vibe'],
      href: '/vibe/overview',
      color: PRODUCT_COLORS['vibe'],
    },
    {
      title: l.text('Studio & API documentation', { context: 'Title of the Studio & API documentation link on the quickstart doc-links row' }),
      description: l.text('Build with chat completions, agents, RAG, and more.', { context: 'Description of the Studio & API documentation link on the quickstart doc-links row' }),
      logo: PRODUCT_LOGOS['studio'],
      href: '/studio-api/overview',
      color: PRODUCT_COLORS['studio'],
    },
    {
      title: l.text('Admin documentation', { context: 'Title of the Admin documentation link on the quickstart doc-links row' }),
      description: l.text('Manage organizations, SSO, billing, and access controls.', { context: 'Description of the Admin documentation link on the quickstart doc-links row' }),
      logo: PRODUCT_LOGOS['admin'],
      href: '/admin/set-up-organization/create-organization',
      color: PRODUCT_COLORS['admin'],
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8 not-prose">
      {DOC_LINKS.map((link) => {
        return (
          <Link
            key={link.href}
            href={link.href}
            className="group flex items-center gap-4 rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:border-primary/30 no-underline hover:no-underline"
          >
            <div className="shrink-0">
              <Image src={link.logo} alt={link.title} width={32} height={32} className="rounded-lg" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                {link.title}
              </span>
              <span className="text-xs text-muted-foreground mt-0.5">
                {link.description}
              </span>
            </div>
            <ArrowRightIcon className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </Link>
        );
      })}
    </div>
  );
}

export function QuickstartCards() {
  const l = useLingo();
  const QUICKSTART_ROLES = [
    {
      title: 'Vibe Work',
      description: l.text('Vibe in the web and mobile chat UI. Run multi-step tasks, no code required.', { context: 'Subtitle describing the Vibe Work mode' }),
      logo: PRODUCT_LOGOS['vibe-work'],
      href: '/getting-started/quickstarts/vibe-work',
      color: PRODUCT_COLORS['vibe-work'],
    },
    {
      title: 'Vibe Code',
      description: l.text('Vibe in your terminal, editor, or as remote sessions. Reads files, edits code, opens PRs.', { context: 'Subtitle describing the Vibe Code mode' }),
      logo: PRODUCT_LOGOS['vibe-code'],
      href: '/getting-started/quickstarts/vibe-code',
      color: PRODUCT_COLORS['vibe-code'],
    },
    {
      title: l.text('Developer', { context: 'Role label for a developer using the API' }),
      description: l.text('Build with the Mistral API, from your first request to agents and RAG.', { context: 'Subtitle under the Developer heading on the Developer quickstart role selector' }),
      logo: PRODUCT_LOGOS['developer'],
      href: '/getting-started/quickstarts/developer',
      color: PRODUCT_COLORS['developer'],
    },
    {
      title: l.text('Admin', { context: 'Name of the Mistral admin console' }),
      description: l.text('Set up and manage your Mistral organization and security.', { context: 'Subtitle under the Admin heading on the Admin quickstart role selector' }),
      logo: PRODUCT_LOGOS['admin'],
      href: '/getting-started/quickstarts/admin',
      color: PRODUCT_COLORS['admin'],
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8 not-prose">
      {QUICKSTART_ROLES.map((card) => {
        return (
          <Link
            key={card.href}
            href={card.href}
            className="group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col no-underline hover:no-underline"
          >
            <PixelGrid pixelSize={8} opacity={0.35} className="text-muted-foreground/10" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none bg-current" />

            <div className="flex flex-col h-full gap-3 relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div className="mb-2">
                  <Image src={card.logo} alt={card.title} width={36} height={36} className="rounded-lg" />
                </div>
                <ArrowRightIcon className="size-4 text-muted-foreground group-hover:text-primary transition-all duration-200 -rotate-45 group-hover:rotate-0 mt-1" />
              </div>
              <h3 className="font-bold text-xl tracking-tight leading-tight text-foreground group-hover:text-primary transition-colors">
                {card.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed flex-1 mt-1">
                {card.description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
