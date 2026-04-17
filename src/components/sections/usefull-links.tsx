import React from 'react';
import { SectionTab } from '../layout/section-tab';
import { LinkCard, UsefullLinkContainer } from '../common/link-card';
import {
  QuestionIcon,
} from '@/components/icons/pixel';
import Image from 'next/image';
import { PRODUCT_LOGOS } from '@/schema/content/getting-started';
import { cn } from '@/lib/utils';
import { MISTRAL_HELP_CENTER_URL } from '@/lib/constants';

interface UsefullLinksSectionProps {
  links?: {
    title: string;
    hoverTitle?: string;
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
            hoverTitle={link.hoverTitle}
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
    title: 'Le Chat',
    hoverTitle: 'Go to Le Chat ↗',
    href: 'https://chat.mistral.ai',
    icon: (
      <Image src={PRODUCT_LOGOS['le-chat']} alt="Le Chat" width={20} height={20} className="rounded" />
    ),
  },
  {
    title: 'Studio',
    hoverTitle: 'Go to Studio ↗',
    href: 'https://console.mistral.ai',
    icon: (
      <Image src={PRODUCT_LOGOS['studio']} alt="Studio" width={20} height={20} className="rounded" />
    ),
  },
  {
    title: 'Help Center',
    hoverTitle: 'Go to Help Center ↗',
    href: `${MISTRAL_HELP_CENTER_URL}`,
    icon: (
      <QuestionIcon className="transition-colors duration-100 dark:group-hover:text-black/70" />
    ),
  },
];
