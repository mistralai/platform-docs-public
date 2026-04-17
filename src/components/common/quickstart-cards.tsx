import Link from 'next/link';
import { ArrowRightIcon } from '@/components/icons/pixel';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PixelGrid } from '@/components/common/pixel-grid';
import { PRODUCT_COLORS, PRODUCT_LOGOS } from '@/schema/content/getting-started';

const QUICKSTART_ROLES = [
  {
    title: 'Le Chat',
    description: "Use Le Chat's collaborative AI workspace. No code required.",
    logo: PRODUCT_LOGOS['le-chat'],
    href: '/getting-started/quickstarts/le-chat',
    color: PRODUCT_COLORS['le-chat'],
  },
  {
    title: 'Admin',
    description: 'Set up and manage your Mistral organization and security.',
    logo: PRODUCT_LOGOS['admin'],
    href: '/getting-started/quickstarts/admin',
    color: PRODUCT_COLORS['admin'],
  },
  {
    title: 'Developer',
    description: 'Build with the Mistral API, from your first request to agents and RAG.',
    logo: PRODUCT_LOGOS['developer'],
    href: '/getting-started/quickstarts/developer',
    color: PRODUCT_COLORS['developer'],
  },
];

const DOC_LINKS = [
  {
    title: 'Le Chat documentation',
    description: 'Explore conversations, Canvas, search, and integrations.',
    logo: PRODUCT_LOGOS['le-chat'],
    href: '/le-chat/overview',
    color: PRODUCT_COLORS['le-chat'],
  },
  {
    title: 'Studio & API documentation',
    description: 'Build with chat completions, agents, RAG, and more.',
    logo: PRODUCT_LOGOS['studio'],
    href: '/studio-api/overview',
    color: PRODUCT_COLORS['studio'],
  },
  {
    title: 'Admin documentation',
    description: 'Manage organizations, SSO, billing, and access controls.',
    logo: PRODUCT_LOGOS['admin'],
    href: '/admin/security-access/back-office',
    color: PRODUCT_COLORS['admin'],
  },
];

export function QuickstartDocLinks() {
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 not-prose">
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
