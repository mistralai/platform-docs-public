import React from 'react';
import { SectionTab } from '../layout/section-tab';
import { LinkCard, UsefullLinkContainer } from '../common/link-card';
import {
  PageIcon,
  RockIcon,
  SmileIcon,
  QuestionIcon,
} from '@/components/icons/pixel';
import { cn } from '@/lib/utils';
import { SOCIALS } from '@/schema/content/socials';
import { MISTRAL_HELP_CENTER_URL, MISTRAL_URL_ORIGIN } from '@/lib/constants';

interface UsefullLinksSectionProps {
  links?: {
    title: string;
    href: string;
    icon: React.ReactNode;
  }[];
  className?: string;
  showTab?: boolean;
}

export default function UsefullLinksSection({
  links = usefullLinks,
  showTab = true,
  className,
}: UsefullLinksSectionProps) {
  return (
    <section
      id="usefull-links"
      className={cn('flex flex-col gap-6', className)}
    >
      {showTab && (
        <SectionTab variant="secondary" sectionId="usefull-links">
          Useful Links
        </SectionTab>
      )}
      <UsefullLinkContainer>
        {links.map(link => (
          <LinkCard
            key={link.title}
            title={link.title}
            href={link.href}
            icon={link.icon}
          />
        ))}
      </UsefullLinkContainer>
    </section>
  );
}

export const usefullLinks = [
  {
    title: 'Help Center',
    href: `${MISTRAL_HELP_CENTER_URL}`,
    icon: (
      <QuestionIcon className="transition-colors duration-100 dark:group-hover:text-black/70" />
    ),
  },
  {
    title: 'Cookbooks',
    href: '/cookbooks',
    icon: (
      <PageIcon className="transition-colors duration-100 dark:group-hover:text-black/70" />
    ),
  },
  {
    title: 'AI Studio',
    href: `${MISTRAL_URL_ORIGIN}/products/la-plateforme`,
    icon: (
      <RockIcon className="transition-colors duration-100 dark:group-hover:text-black/70" />
    ),
  },
  {
    title: 'Discord',
    href: SOCIALS.discord,
    icon: (
      <SmileIcon className="transition-colors duration-100 dark:group-hover:text-black/70" />
    ),
  },
];
