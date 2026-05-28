import React from 'react';
import MistralLogoSolid from '../../icons/assets/mistral-logo-solid';
import Image from 'next/image';
import { Link } from '@/i18n/navigation.client';
import googlePlayBadge from '@/../public/assets/badges/GetItOnGooglePlay_Badge_Web_color_English.png';
import appStoreBadge from '@/../public/assets/badges/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg';
import AnimatedGround from './animated-ground';
import BackgroundGradient from './background';
import AnimatedStarsBackground from './animated-stars';
import { MISTRAL_API_REFERENCE_URL, MISTRAL_URL } from '@/lib/constants';
import { SOCIALS } from '@/schema/content/socials';
import CookieTrigger from './cookie-trigger';
import { ThemeToggle } from '../header/theme-toggle';
import { getLingo } from '@/i18n/server';
import type { Locale } from '@/i18n/config';

// Footer schema definition
type CookieLink = { label: string; type: 'cookie' };
type StandardLink = {
  label: string;
  href: string;
  external?: boolean;
  icon?: string;
};
type FooterLinkItem = CookieLink | StandardLink;

interface FooterSection {
  title: string;
  links: FooterLinkItem[];
}

// Reusable Footer Column Component
const FooterColumn: React.FC<{
  section: FooterSection;
}> = ({ section }) => (
  <div className="flex flex-col space-y-4">
    <h3 className="text-xs font-semibold uppercase font-mono">
      {section.title}
    </h3>
    <div className="flex flex-col space-y-3">
      {section.links.map((link, index) => {
        if ('type' in link && link.type === 'cookie') {
          return <CookieTrigger key={index} title={link.label} />;
        }
        if ('href' in link) {
          return <FooterLink key={index} {...link} />;
        }
        return null;
      })}
    </div>
  </div>
);

// Reusable Footer Link Component
const FooterLink: React.FC<{
  label: string;
  href: string;
  external?: boolean;
  icon?: string;
}> = ({ label, href, external, icon }) => (
  <Link
    href={href}
    prefetch={false}
    className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-200 flex items-center gap-1"
    {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
  >
    {label}
    {icon && <span className="text-xs font-mono font-bold">{icon}</span>}
  </Link>
);

// App Store Badges Component
const AppStoreBadges: React.FC = () => (
  <div className="flex gap-4 justify-center">
    <a href="#" className="block">
      <Image
        src={appStoreBadge}
        alt="Download on the App Store"
        className="h-12 w-auto"
      />
    </a>
    <a href="#" className="block">
      <Image
        src={googlePlayBadge}
        alt="Get it on Google Play"
        className="h-12 w-auto"
      />
    </a>
  </div>
);

export default async function Footer({ locale }: { locale: Locale }) {
  const l = await getLingo(locale);
  const footerSchema: { sections: FooterSection[] } = {
    sections: [
      {
        title: l.text('WHY MISTRAL', { context: 'Footer heading for company information' }),
        links: [
          { label: l.text('About us', { context: 'Footer link to company information' }), href: `${MISTRAL_URL}/about` },
          { label: l.text('Our customers', { context: 'Footer link to customer stories' }), href: `${MISTRAL_URL}/customers` },
          { label: l.text('Careers', { context: 'Footer link to job openings' }), href: `${MISTRAL_URL}/careers` },
          { label: l.text('Contact us', { context: 'Footer link to contact the company' }), href: `${MISTRAL_URL}/contact` },
        ],
      },
      {
        title: l.text('EXPLORE', { context: 'Footer heading for company offerings and research' }),
        links: [
          { label: l.text('AI Solutions', { context: 'Footer link to AI solutions' }), href: `${MISTRAL_URL}/solutions` },
          { label: l.text('Partners', { context: 'Footer link to partners' }), href: `${MISTRAL_URL}/partners` },
          { label: l.text('Research', { context: 'Footer link to research news' }), href: `${MISTRAL_URL}/news?category=Research` },
        ],
      },
      {
        title: l.text('DOCUMENTATION', { context: 'Footer heading for documentation links' }),
        links: [
          { label: l.text('Documentation', { context: 'Footer link to documentation' }), href: '/' },
          { label: l.text('Ambassadors', { context: 'Footer link to the Mistral ambassador program' }), href: '/community/ambassadors' },
          { label: l.text('Cookbooks', { context: 'Footer link to developer cookbooks' }), href: '/resources/cookbooks' },
        ],
      },
      {
        title: l.text('BUILD', { context: 'Footer heading for products used to build with Mistral' }),
        links: [
          {
            label: 'Studio',
            href: 'https://console.mistral.ai',
          },
          { label: 'Vibe', href: `${MISTRAL_URL}/products/vibe` },
          { label: 'Mistral Code', href: `${MISTRAL_URL}/products/mistral-code` },
          {
            label: 'Mistral Compute',
            href: `${MISTRAL_URL}/products/mistral-compute`,
          },
          { label: l.text('Try the API', { context: 'Footer link to the API reference' }), href: `${MISTRAL_API_REFERENCE_URL}` },
        ],
      },
      {
        title: l.text('LEGAL', { context: 'Footer heading for legal information' }),
        links: [
          { label: l.text('Terms of service', { context: 'Footer link to terms of service' }), href: `${MISTRAL_URL}/terms` },
          {
            label: l.text('Privacy policy', { context: 'Footer link to the privacy policy' }),
            href: `${MISTRAL_URL}/terms#privacy-policy`,
          },
          // TODO: Privacy choices link displays a cookie modal, handled by cookie type below
          { label: l.text('Legal notice', { context: 'Footer link to the legal notice' }), href: `${MISTRAL_URL}/legal` },
          {
            label: l.text('Privacy Choices', { context: 'Button to manage cookie privacy choices' }),
            type: 'cookie',
          },
          {
            label: l.text('Brand', { context: 'Footer link to brand assets' }),
            href: `${MISTRAL_URL}/brand`,
          },
        ],
      },
      {
        title: l.text('COMMUNITY', { context: 'Footer heading for community links' }),
        links: [
          {
            label: 'Discord',
            href: SOCIALS.discord,
            external: true,
            icon: '↗',
          },
          {
            label: 'X',
            href: SOCIALS.twitter,
            external: true,
            icon: '↗',
          },
          {
            label: 'Github',
            href: SOCIALS.github,
            external: true,
            icon: '↗',
          },
          {
            label: 'LinkedIn',
            href: SOCIALS.linkedin,
            external: true,
            icon: '↗',
          },
          { label: l.text('Ambassadors', { context: 'Footer link to the Mistral ambassador community' }), href: '/community/ambassadors' },
        ],
      },
    ],
  };
  return (
    <footer className="mt-10 w-[-webkit-fill-available] max-lg:-mx-inner-sides lg:w-full flex flex-col max-lg:px-inner-sides">
      <div className="relative overflow-clip pt-40">
        <BackgroundGradient />
        <AnimatedStarsBackground />

        {/* Main Footer Content */}
        <div className="relative z-10 lg:max-w-5xl lg:mx-auto flex flex-col gap-6 px-inner-sides lg:px-sides">
          {/* Mistral Logo */}
          <div className="flex justify-center mb-12">
            <MistralLogoSolid className="w-16 text-foreground" />
          </div>

          {/* Footer Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
            {footerSchema.sections.map((section, index) => (
              <FooterColumn key={index} section={section} />
            ))}
          </div>

          {/* Copyright */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-foreground/50">
              Mistral AI © {new Date().getFullYear()}
            </p>
            <ThemeToggle />
          </div>
        </div>

        <AnimatedGround />
      </div>
    </footer>
  );
}
