'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation.client';
import Image from 'next/image';
import { ArrowRightIcon, ClockIcon } from '@/components/icons/pixel';
import { cn } from '@/lib/utils';
import { PRODUCT_LOGOS } from '@/schema/content/getting-started';
import { useLingo } from '@lingo.dev/react';

type Category = 'all' | 'vibe-work' | 'vibe-code' | 'studio' | 'developer' | 'admin';

export function QuickstartsFilterableGrid({ categories }: { categories?: Exclude<Category, 'all'>[] } = {}) {
  const l = useLingo();
  const [filter, setFilter] = useState<Category>('all');

  const ALL_FILTERS: { id: Category; label: string }[] = [
    { id: 'vibe-work', label: 'Vibe Work' },
    { id: 'vibe-code', label: 'Vibe Code' },
    { id: 'studio', label: 'Studio' },
    { id: 'developer', label: 'API' },
    { id: 'admin', label: 'Admin' },
  ];

  const allowedCategories = categories ?? ['vibe-work', 'vibe-code', 'studio', 'developer', 'admin'];
  const filteredPills = ALL_FILTERS.filter(p => allowedCategories.includes(p.id as Exclude<Category, 'all'>));
  const FILTERS = filteredPills.length > 1
    ? [{ id: 'all' as Category, label: l.text('All', { context: 'Quickstarts filter label for all categories' }) }, ...filteredPills]
    : filteredPills;

  const HOVER_BY_CATEGORY: Record<Exclude<Category, 'all'>, { text: string; bg: string }> = {
    'vibe-work': { text: 'group-hover:text-[#FA500F]', bg: 'group-hover:bg-[#FA500F]' },
    'vibe-code': { text: 'group-hover:text-[#FA500F]', bg: 'group-hover:bg-[#FA500F]' },
    'studio': { text: 'group-hover:text-[#0082E6]', bg: 'group-hover:bg-[#0082E6]' },
    'developer': { text: 'group-hover:text-[#0082E6]', bg: 'group-hover:bg-[#0082E6]' },
    'admin': { text: 'group-hover:text-[#4a4a5e]', bg: 'group-hover:bg-[#4a4a5e]' },
  };

  const QUICKSTARTS: {
    category: Exclude<Category, 'all'>;
    title: string;
    description: string;
    time: string;
    href: string;
    logo: string;
    alt: string;
    activeBorder: string;
  }[] = [
    // Vibe Work
    {
      category: 'vibe-work',
      title: l.text('Run your first Vibe Work task', { context: 'Quickstart title about running a first Vibe Work task' }),
      description: l.text('Open Vibe Work, run a multi-step task end-to-end, and review the result.', { context: 'Quickstart description about running a first Vibe Work task' }),
      time: '5 min',
      href: '/getting-started/quickstarts/vibe-work/first-task',
      logo: PRODUCT_LOGOS['vibe-work'],
      alt: 'Vibe Work',
      activeBorder: 'hover:border-[#FA500F]/50',
    },

    {
      category: 'vibe-work',
      title: l.text('Analyze a dataset', { context: 'Quickstart title about analyzing data in Vibe Work' }),
      description: l.text('Upload a spreadsheet and ask questions in plain language. Work writes and runs code.', { context: 'Quickstart description about analyzing data in Vibe Work' }),
      time: '10 min',
      href: '/getting-started/quickstarts/vibe-work/analyze-data',
      logo: PRODUCT_LOGOS['vibe-work'],
      alt: 'Vibe Work',
      activeBorder: 'hover:border-[#FA500F]/50',
    },
    {
      category: 'vibe-work',
      title: l.text('Create your first Skill', { context: 'Quickstart title about creating a first Skill in Vibe Work' }),
      description: l.text('Package a repeatable method into a Skill so Work applies the same procedure every time.', { context: 'Quickstart description about creating a first Skill in Vibe Work' }),
      time: '10 min',
      href: '/getting-started/quickstarts/vibe-work/create-first-skill',
      logo: PRODUCT_LOGOS['vibe-work'],
      alt: 'Vibe Work',
      activeBorder: 'hover:border-[#FA500F]/50',
    },
    // Vibe Code
    {
      category: 'vibe-code',
      title: l.text('Install the Vibe CLI', { context: 'Quickstart title about installing the Vibe CLI' }),
      description: l.text('Install the CLI, configure your API key, and send your first prompt from the terminal.', { context: 'Quickstart description about installing the Vibe CLI' }),
      time: '5 min',
      href: '/getting-started/quickstarts/vibe-code/install-cli',
      logo: PRODUCT_LOGOS['vibe-code'],
      alt: 'Vibe Code',
      activeBorder: 'hover:border-[#FA500F]/50',
    },
    {
      category: 'vibe-code',
      title: l.text('Scaffold a project with Vibe Code', { context: 'Quickstart title about scaffolding a project with Vibe Code' }),
      description: l.text('Describe a project in natural language and let Vibe Code generate the files and structure.', { context: 'Quickstart description about scaffolding a project with Vibe Code' }),
      time: '10 min',
      href: '/getting-started/quickstarts/vibe-code/scaffold-a-project',
      logo: PRODUCT_LOGOS['vibe-code'],
      alt: 'Vibe Code',
      activeBorder: 'hover:border-[#FA500F]/50',
    },
    // Studio
    {
      category: 'studio',
      title: l.text('Activate Studio and generate an API key', { context: 'Quickstart title about activating Studio and generating an API key' }),
      description: l.text('Activate Studio in Free mode and generate your first API key.', { context: 'Quickstart description about activating Studio and generating an API key' }),
      time: '5 min',
      href: '/getting-started/quickstarts/studio/activate-and-generate-api-key',
      logo: PRODUCT_LOGOS['studio'],
      alt: 'Studio',
      activeBorder: 'hover:border-[#0082E6]/50',
    },
    {
      category: 'studio',
      title: l.text('Test a model in the API playground', { context: 'Quickstart title about testing an AI model in the Studio playground' }),
      description: l.text('Send prompts, adjust parameters, and compare model outputs in the Studio playground.', { context: 'Quickstart description about testing an AI model in the Studio playground' }),
      time: '5 min',
      href: '/getting-started/quickstarts/studio/test-model-playground',
      logo: PRODUCT_LOGOS['studio'],
      alt: 'Studio',
      activeBorder: 'hover:border-[#0082E6]/50',
    },
    // Developer (filtered under Studio)
    {
      category: 'developer',
      title: l.text('Send your first API request', { context: 'Quickstart title about send your first API request quickstart (used as browser tab title and on' }),
      description: l.text('Install the SDK, set your API key, and get a model response.', { context: 'Quickstart description about sending the first API request' }),
      time: '5 min',
      href: '/getting-started/quickstarts/developer/first-api-request',
      logo: PRODUCT_LOGOS['studio'],
      alt: 'Studio',
      activeBorder: 'hover:border-[#0082E6]/50',
    },
    {
      category: 'developer',
      title: l.text('Build an agent with tools', { context: 'Quickstart title about build an agent with tools quickstart (used as browser tab title and on' }),
      description: l.text('Define tools, let the model call functions, and return real-world data.', { context: 'Quickstart description about building an agent with tools' }),
      time: '10 min',
      href: '/getting-started/quickstarts/developer/build-an-agent',
      logo: PRODUCT_LOGOS['studio'],
      alt: 'Studio',
      activeBorder: 'hover:border-[#0082E6]/50',
    },
    {
      category: 'developer',
      title: l.text('Set up RAG with document search', { context: 'Quickstart title about setting up RAG with document search' }),
      description: l.text('Upload documents and query them with retrieval-augmented generation.', { context: 'Quickstart description about setting up RAG with document search' }),
      time: '15 min',
      href: '/getting-started/quickstarts/developer/rag-document-search',
      logo: PRODUCT_LOGOS['studio'],
      alt: 'Studio',
      activeBorder: 'hover:border-[#0082E6]/50',
    },
    {
      category: 'developer',
      title: l.text('Build a workflow', { context: 'Quickstart title about building a workflow' }),
      description: l.text('Scaffold a durable AI pipeline, run a worker, and trigger your first execution.', { context: 'Quickstart description about building a workflow' }),
      time: '15 min',
      href: '/getting-started/quickstarts/developer/build-a-workflow',
      logo: PRODUCT_LOGOS['studio'],
      alt: 'Studio',
      activeBorder: 'hover:border-[#0082E6]/50',
    },
    // Admin
    {
      category: 'admin',
      title: l.text('Create your organization', { context: 'Quickstart title about create your organization quickstart (used as browser tab title and on' }),
      description: l.text('Set up billing, workspaces, and invite your first team members.', { context: 'Quickstart description about creating a Mistral organization' }),
      time: '15 min',
      href: '/getting-started/quickstarts/admin/create-organization',
      logo: PRODUCT_LOGOS['admin'],
      alt: 'Admin',
      activeBorder: 'hover:border-[#4a4a5e]/50',
    },
    {
      category: 'admin',
      title: l.text('Configure SSO', { context: 'Quickstart title about configure SSO quickstart (used as browser tab title and on' }),
      description: l.text('Set up SAML Single Sign-On for enterprise authentication.', { context: 'Quickstart description about configuring SAML SSO' }),
      time: '15 min',
      href: '/getting-started/quickstarts/admin/configure-sso',
      logo: PRODUCT_LOGOS['admin'],
      alt: 'Admin',
      activeBorder: 'hover:border-[#4a4a5e]/50',
    },
    {
      category: 'admin',
      title: l.text('Manage workspaces & API keys', { context: 'Quickstart title about managing workspaces and API keys' }),
      description: l.text('Create isolated workspaces, generate keys, and set usage limits.', { context: 'Quickstart description about managing workspaces and API keys' }),
      time: '10 min',
      href: '/getting-started/quickstarts/admin/manage-workspaces',
      logo: PRODUCT_LOGOS['admin'],
      alt: 'Admin',
      activeBorder: 'hover:border-[#4a4a5e]/50',
    },
  ];

  const scopedQuickstarts = QUICKSTARTS.filter(q => allowedCategories.includes(q.category));
  const filtered = filter === 'all' ? scopedQuickstarts : scopedQuickstarts.filter(q => q.category === filter);

  return (
    <>
      {FILTERS.length > 1 && <div className="flex flex-wrap justify-end gap-2">
        {FILTERS.map(f => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              'cursor-pointer px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-colors border',
              filter === f.id
                ? 'bg-foreground text-background border-foreground'
                : 'bg-card text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(qs => (
          <Link
            key={qs.href}
            href={qs.href}
            className={cn(
              'group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col no-underline hover:no-underline',
              qs.activeBorder
            )}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-transparent to-current" />
            <div className="flex flex-col h-full gap-3 relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div className="mb-2">
                  <Image src={qs.logo} alt={qs.alt} width={qs.category === 'admin' ? 39 : 36} height={qs.category === 'admin' ? 39 : 36} className="rounded-lg" />
                </div>
                <div className={cn('shrink-0 flex items-center justify-center size-8 rounded-full bg-secondary text-secondary-foreground group-hover:text-white transition-colors transition-transform duration-300 group-hover:scale-110', HOVER_BY_CATEGORY[qs.category].bg)}>
                  <ArrowRightIcon className="size-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                </div>
              </div>
              <h3 className={cn('font-bold text-xl tracking-tight leading-tight text-foreground transition-colors', HOVER_BY_CATEGORY[qs.category].text)}>
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
    </>
  );
}
