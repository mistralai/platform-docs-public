'use client';

import { Link } from '@/i18n/navigation.client';
import { AdminQuickstartsGrid } from '@/components/common/admin-quickstarts-grid';
import {
  FolderIcon,
  ArrowRightIcon,
} from '@/components/icons/pixel';
import Image from 'next/image';
import { PRODUCT_COLORS, SECTION_LOGOS } from '@/schema/content/getting-started';
import { SectionTab } from '@/components/layout/section-tab';
import { useLingo } from '@lingo.dev/react';

export function AdminOverview({ showCta = false, showHeader = true }: { locale?: string; showCta?: boolean; showHeader?: boolean }) {
  const l = useLingo();
  const ADMIN_SECTIONS = [
    {
      title: l.text('Back Office', { context: 'Title of a documentation card about Back Office' }),
      description: l.text('View your organization dashboard, manage workspaces, and configure workspace settings.', { context: 'Description of a documentation card about Back Office' }),
      icon: FolderIcon,
      href: '/admin/security-access/back-office',
      color: PRODUCT_COLORS['admin'],
    },
    {
      title: l.text('SSO & Authentication', { context: 'Title of a documentation card about SSO & Authentication' }),
      description: l.text('Set up SAML-based single sign-on and enforce identity provider authentication for your organization.', { context: 'Description of a documentation card about SSO & Authentication' }),
      icon: FolderIcon,
      href: '/admin/security-access/sso',
      color: PRODUCT_COLORS['admin'],
    },
    {
      title: l.text('API Keys', { context: 'Title of a documentation card about API Keys' }),
      description: l.text('Create, rotate, and revoke API keys across workspaces.', { context: 'Description of a documentation card about API Keys' }),
      icon: FolderIcon,
      href: '/admin/security-access/api-keys',
      color: PRODUCT_COLORS['admin'],
    },
    {
      title: 'Connectors',
      description: 'Connect organization-level bots and control Connector tool access.',
      icon: FolderIcon,
      href: '/admin/security-access/connectors',
      color: PRODUCT_COLORS['admin'],
    },
    {
      title: l.text('User Management', { context: 'Title of a documentation card about User Management' }),
      description: l.text('Invite members, assign roles, and control permissions across your organization.', { context: 'Description of a documentation card about User Management' }),
      icon: FolderIcon,
      href: '/admin/user-management-finops/user-management',
      color: PRODUCT_COLORS['admin'],
    },
    {
      title: l.text('Billing & Usage', { context: 'Title of a documentation card about Billing & Usage' }),
      description: l.text('Track consumption, manage subscriptions, and set usage limits per workspace.', { context: 'Description of a documentation card about Billing & Usage' }),
      icon: FolderIcon,
      href: '/admin/user-management-finops/billing',
      color: PRODUCT_COLORS['admin'],
    },
  ];
  return (
    <div className="flex flex-col gap-6">
      {showHeader && (
        <>
          <div className="flex items-center gap-4">
            <Image src={SECTION_LOGOS['admin']} alt={l.text('Admin', { context: 'Alt text for the Admin section logo' })} width={40} height={40} />
            <div>
              <h2 className="font-bold text-2xl tracking-tight text-foreground">{l.text('Admin', { context: 'Heading for admin documentation' })}</h2>
              <p className="text-muted-foreground text-base">
                {l.text('Organization setup, security, user management, and billing.', { context: 'Subtitle for admin documentation' })}
              </p>
            </div>
          </div>
          <p className="text-muted-foreground text-base leading-relaxed max-w-3xl">
            {l.text('The Admin Panel is where you set up your organization, configure SSO, manage API keys and users, and track billing. Use it to control access, enforce security policies, and monitor usage across workspaces.', { context: 'Introductory description of the admin console' })}
          </p>
        </>
      )}
      <SectionTab sectionId="admin-explore">{l.text('Explore', { context: 'Heading for admin documentation links' })}</SectionTab>
      <p className="text-muted-foreground text-base">
        {l.text('SSO, API keys, roles and permissions, usage tracking, and billing across workspaces.', { context: 'Intro text for admin documentation links' })}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ADMIN_SECTIONS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1 hover:border-[#4a4a5e]/50 flex flex-col no-underline hover:no-underline"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-transparent to-current" />

              <div className="flex flex-col h-full gap-3 relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`p-2 rounded-lg ${item.color.bg} ${item.color.text} mb-2`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="shrink-0 flex items-center justify-center size-8 rounded-full bg-secondary text-secondary-foreground group-hover:bg-[#4a4a5e] group-hover:text-white transition-colors transition-transform duration-300 group-hover:scale-110">
                    <ArrowRightIcon className="size-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                  </div>
                </div>
                <h3 className="font-bold text-xl tracking-tight leading-tight text-foreground group-hover:text-[#4a4a5e] transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1 mt-1">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <SectionTab sectionId="admin-quickstarts">{l.text('Quickstarts', { context: 'Heading for admin quickstarts' })}</SectionTab>
      <p className="text-muted-foreground text-base">
        {l.text('Hands-on guides to set up your organization, configure SSO, and manage workspaces. Most take 15 minutes or less.', { context: 'Intro text for admin quickstarts on the admin overview page' })}
      </p>
      <AdminQuickstartsGrid />

      {showCta && (
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline mt-2"
        >
          {l.text('Go to Admin', { context: 'Call to open the admin console' })}
          <ArrowRightIcon className="size-4" />
        </Link>
      )}
    </div>
  );
}
