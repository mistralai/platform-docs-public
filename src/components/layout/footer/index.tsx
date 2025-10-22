import React from 'react';
import MistralLogoSolid from '../../icons/assets/mistral-logo-solid';
import Image from 'next/image';
import googlePlayBadge from '@/../public/assets/badges/GetItOnGooglePlay_Badge_Web_color_English.png';
import appStoreBadge from '@/../public/assets/badges/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg';
import AnimatedGround from './animated-ground';
import BackgroundGradient from './background';
import AnimatedStarsBackground from './animated-stars';
import { MISTRAL_API_REFERENCE_URL, MISTRAL_URL } from '@/lib/constants';
import { SOCIALS } from '@/schema/content/socials';
import CookieTrigger from './cookie-trigger';

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

const footerSchema: { sections: FooterSection[] } = {
  sections: [
    {
      title: 'WHY MISTRAL',
      links: [
        { label: 'About us', href: `${MISTRAL_URL}/about` },
        { label: 'Our customers', href: `${MISTRAL_URL}/customers` },
        { label: 'Careers', href: `${MISTRAL_URL}/careers` },
        { label: 'Contact us', href: `${MISTRAL_URL}/contact` },
      ],
    },
    {
      title: 'EXPLORE',
      links: [
        { label: 'AI Solutions', href: `${MISTRAL_URL}/solutions` },
        { label: 'Partners', href: `${MISTRAL_URL}/partners` },
        { label: 'Research', href: `${MISTRAL_URL}/news?category=Research` },
      ],
    },
    {
      title: 'DOCUMENTATION',
      links: [
        { label: 'Documentation', href: '/' },
        { label: 'Contributing', href: '/ambassadors' },
        { label: 'Cookbooks', href: '/cookbooks' },
      ],
    },
    {
      title: 'BUILD',
      links: [
        {
          label: 'AI Studio',
          href: `${MISTRAL_URL}/products/la-plateforme`,
        },
        { label: 'Le Chat', href: `${MISTRAL_URL}/products/le-chat` },
        { label: 'Mistral Code', href: `${MISTRAL_URL}/products/mistral-code` },
        {
          label: 'Mistral Compute',
          href: `${MISTRAL_URL}/products/mistral-compute`,
        },
        { label: 'Try the API', href: `${MISTRAL_API_REFERENCE_URL}` },
      ],
    },
    {
      title: 'LEGAL',
      links: [
        { label: 'Terms of service', href: `${MISTRAL_URL}/terms` },
        {
          label: 'Privacy policy',
          href: `${MISTRAL_URL}/terms#privacy-policy`,
        },
        // { label: 'Privacy choices', href: `${MISTRAL_URL}/privacy-choices` }, TODO: This displays a cookie modal
        { label: 'Legal notice', href: `${MISTRAL_URL}/legal` },
        {
          label: 'Privacy Choices',
          type: 'cookie',
        },
        {
          label: 'Brand',
          href: `${MISTRAL_URL}/brand`,
        },
      ],
    },
    {
      title: 'COMMUNITY',
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
        { label: 'Ambassador', href: '/ambassadors' },
      ],
    },
  ],
};

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
  <a
    href={href}
    className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-200 flex items-center gap-1"
    {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
  >
    {label}
    {icon && <span className="text-xs font-mono font-bold">{icon}</span>}
  </a>
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

export default function Footer() {
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

          {/* App Store Badges */}
          <div className="mb-8">
            <AppStoreBadges />
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-sm font-mono uppercase text-foreground/50">
              COPYRIGHT © {new Date().getFullYear()} MISTRAL AI
            </p>
          </div>
        </div>

        <AnimatedGround />
      </div>
    </footer>
  );
}
