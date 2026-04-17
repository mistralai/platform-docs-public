import Link from 'next/link';
import { AdminQuickstartsGrid } from '@/components/common/admin-quickstarts-grid';
import {
  KeyIcon,
  UserIcon,
  LockIcon,
  HomeIcon,
  StatsIcon,
  ArrowRightIcon,
} from '@/components/icons/pixel';
import Image from 'next/image';
import { PRODUCT_COLORS, SECTION_LOGOS } from '@/schema/content/getting-started';
import { SectionTab } from '@/components/layout/section-tab';

const ADMIN_SECTIONS = [
  {
    title: 'Back Office',
    description:
      'View your organization dashboard, manage workspaces, and configure workspace settings.',
    icon: HomeIcon,
    href: '/admin/security-access/back-office',
    color: PRODUCT_COLORS['admin'],
  },
  {
    title: 'SSO & Authentication',
    description:
      'Set up SAML-based single sign-on and enforce identity provider authentication for your organization.',
    icon: LockIcon,
    href: '/admin/security-access/sso',
    color: PRODUCT_COLORS['admin'],
  },
  {
    title: 'API Keys',
    description: 'Create, rotate, and revoke API keys across workspaces.',
    icon: KeyIcon,
    href: '/admin/security-access/api-keys',
    color: PRODUCT_COLORS['admin'],
  },
  {
    title: 'User Management',
    description:
      'Invite members, assign roles, and control permissions across your organization.',
    icon: UserIcon,
    href: '/admin/user-management-finops/user-management',
    color: PRODUCT_COLORS['admin'],
  },
  {
    title: 'Billing & Usage',
    description:
      'Track consumption, manage subscriptions, and set usage limits per workspace.',
    icon: StatsIcon,
    href: '/admin/user-management-finops/billing',
    color: PRODUCT_COLORS['admin'],
  },
];

export function AdminOverview({ showCta = false, showHeader = true }: { showCta?: boolean; showHeader?: boolean }) {
  return (
    <div className="flex flex-col gap-6">
      {showHeader && (
        <>
          <div className="flex items-center gap-4">
            <Image src={SECTION_LOGOS['admin']} alt="Admin" width={40} height={40} />
            <div>
              <h2 className="font-bold text-2xl tracking-tight text-foreground">Admin</h2>
              <p className="text-muted-foreground text-base">
                Organization setup, security, user management, and billing.
              </p>
            </div>
          </div>
          <p className="text-muted-foreground text-base leading-relaxed max-w-3xl">
            The Admin Panel is where you set up your organization, configure SSO, manage API keys and
            users, and track billing. Use it to control access, enforce security policies, and monitor
            usage across workspaces.
          </p>
        </>
      )}
      <SectionTab sectionId="admin-quickstarts">Quickstarts</SectionTab>
      <AdminQuickstartsGrid />

      <SectionTab sectionId="admin-explore">Explore</SectionTab>
      <p className="text-muted-foreground text-sm">
        Configure SSO, manage API keys, assign roles and permissions, and track usage and billing across workspaces.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ADMIN_SECTIONS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col no-underline hover:no-underline"
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
                  <div className="shrink-0 flex items-center justify-center size-8 rounded-full bg-secondary text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors transition-transform duration-300 group-hover:scale-110">
                    <ArrowRightIcon className="size-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                  </div>
                </div>
                <h3 className="font-bold text-xl tracking-tight leading-tight text-foreground group-hover:text-primary transition-colors">
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

      {showCta && (
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline mt-2"
        >
          Go to Admin
          <ArrowRightIcon className="size-4" />
        </Link>
      )}
    </div>
  );
}
