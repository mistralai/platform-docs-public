'use client';

import { SectionTab } from '@/components/layout/section-tab';
import {
  Heading,
  HeadingSubtitle,
  HeadingTitle,
} from '@/components/layout/heading';
import { MistralIcon } from '@/components/icons/mistral';
import { cn } from '@/lib/utils';
import MistralFlower from '@/components/icons/assets/mistral-flower';
import { PotionBottleIcon } from '@/components/icons/pixel/potion-bottle';
import { AmbassadorCard } from './components/ambassador-card';
import { Button } from '@/components/ui/button';
import { Bullet } from '@/components/ui/bullet';
import { MODEL_COLORS, type ModelColor } from '@/lib/colors';
import { ColorBulbIcon } from '@/components/icons/pixel';
import { AirBalloonIcon } from '@/components/icons/pixel/air-balloom';
import { MagnifyingGlassIcon } from '@/components/icons/pixel/magnifying-glass';
import Image from 'next/image';
import {
  currentAmbassadors,
  placeholderAmbassador,
  ambassadorBenefits,
  ambassadorResponsibilities,
  ambassadorRequirements,
  applicationInfo,
  applicationCriteria,
} from '@/schema/ambassadors';
import { AmbassadorYouImage } from './components/ambassador-you-image';
import NoSidebarPageLayout from '@/components/layout/no-sidebar-page-layout';

// Import metadata to ensure it's included in the build
import './metadata';

const getAmbassadorColor = (index: number): ModelColor => {
  const colors: ModelColor[] = [
    'pink',
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'purple',
    'beige',
  ];
  return colors[index % colors.length];
};

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'lamp':
      return <ColorBulbIcon className="size-14" />;
    case 'air-balloon':
      return <AirBalloonIcon className="size-15" />;
    case 'codestral':
      return (
        <Image
          src="/assets/models/Codestral.svg"
          alt="Codestral"
          width={56}
          height={56}
          className="size-14"
        />
      );
    case 'magnifying-glass':
      return <MagnifyingGlassIcon className="size-16" />;
    default:
      return null;
  }
};

export default function AmbassadorsPage() {
  return (
    <NoSidebarPageLayout>
      <div className="flex flex-col items-center justify-center lg:pt-10">
        <Heading className="not-prose flex flex-col md:items-center justify-center gap-6">
          <div className="w-fit">
            <HeadingTitle
              className="text-balance md:text-center relative text-3xl sm:text-4xl"
              size="h1"
              as="h1"
            >
              <MistralFlower
                className={cn(
                  'size-12 absolute -left-10 -rotate-12 hidden md:block',
                  'text-[#FF91DC]',
                  'hover:scale-110 transition-transform duration-200'
                )}
              />
              <span className="flex items-center md:justify-center relative z-10 whitespace-nowrap">
                <span>Welcome to the</span>
                <MistralIcon
                  className={cn(
                    'ml-2 md:ml-3 size-6 md:size-12',
                    'hover:scale-110 hover:rotate-12 transition-transform duration-200'
                  )}
                />
                istral
              </span>
            </HeadingTitle>
            <HeadingTitle
              className="text-balance md:text-center flex items-center md:justify-center gap-2 relative whitespace-nowrap text-3xl sm:text-4xl"
              size="h1"
              as="h1"
            >
              AI Ambassador program
              <PotionBottleIcon
                className={cn(
                  'size-10 md:size-14 lg:size-20 absolute -right-6 md:-right-8 lg:-right-12',
                  'hover:scale-110 transition-transform duration-200'
                )}
              />
            </HeadingTitle>
          </div>
          <HeadingSubtitle className="md:text-center max-w-2xl">
            As our Mistral AI community continues to grow, we are looking for
            Mistral experts who are passionate about our models and offerings,
            and who are committed to giving back to the community and supporting
            fellow members.
          </HeadingSubtitle>
        </Heading>
      </div>

      {/* Ambassadors */}
      <section>
        <SectionTab className="mb-6" sectionId="ambassadors">
          Ambassadors
        </SectionTab>
        <div>
          <h3 className="font-bold text-2xl mb-6">
            Meet out current Ambassadors
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {currentAmbassadors.map((ambassador, index) => {
              const colorKey = getAmbassadorColor(index);
              const colorValue = MODEL_COLORS[colorKey];
              return (
                <AmbassadorCard
                  key={ambassador.id}
                  name={ambassador.name}
                  image={ambassador.image || '/ambassadors/people-1.png'}
                  link={ambassador.link}
                  style={
                    {
                      backgroundColor: colorValue,
                      boxShadow: `0 10px 15px -3px ${colorValue}50`,
                    } as React.CSSProperties
                  }
                />
              );
            })}
            {placeholderAmbassador && (
              <AmbassadorCard
                key={placeholderAmbassador.id}
                name={placeholderAmbassador.name}
                className="group"
                image={<AmbassadorYouImage />}
                link={placeholderAmbassador.link}
                color="secondary"
              />
            )}
          </div>
        </div>
      </section>

      <section>
        <SectionTab sectionId="apply" className="mb-6">
          Apply
        </SectionTab>
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-2xl">Apply to join the team</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <p className="text-foreground">
              Applications for the {applicationInfo.cohort} cohort are now open
              and will be accepted until {applicationInfo.deadline}. If
              selected, you will be contacted by the{' '}
              {applicationInfo.notification} to discuss next steps and possibly
              participate in an interview with additional questions.
            </p>
            <div className="flex flex-col gap-4 justify-between">
              <p className="text-foreground">
                Our team will review each application, evaluating candidates
                based on the following criteria. We accept applications on a{' '}
                {applicationInfo.frequency}.
              </p>
              <Button
                variant="tertiary"
                className="font-mono uppercase text-sm md:w-fit gap-3 cursor-pointer"
                onClick={() => {
                  window.open('https://docs.google.com/forms/d/e/1FAIpQLSdBSiRzm2xBpMszB_9fBixJNyKdGnPMj99DtZbagHMdHgkGUg/viewform', '_blank', 'noopener,noreferrer');
                }}
              >
                <Bullet />
                Fill out your application ↗
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {applicationCriteria.map(criterion => (
              <div
                key={criterion.id}
                className="border border-border/50 p-4 rounded-lg flex gap-2 justify-between"
              >
                <div className="max-w-[70%]">
                  <h4 className="text-foreground">
                    <span className="font-bold">{criterion.title}: </span>
                    {criterion.description}
                  </h4>
                </div>
                {getIconComponent(criterion.icon)}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <SectionTab variant="secondary" sectionId="benefits" className="mb-6">
          benefits
        </SectionTab>
        <div>
          <ul className="flex flex-col gap-2">
            {ambassadorBenefits.map(benefit => (
              <li key={benefit.id} className="flex gap-3 items-center">
                <Bullet />
                <span className="w-fit text-foreground">
                  <span className="font-bold">{benefit.title}:</span>{' '}
                  {benefit.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <SectionTab
          variant="secondary"
          sectionId="role and responsibilities"
          className="mb-6"
        >
          <span className="truncate">Role and responsibilities</span>
        </SectionTab>
        <div>
          <ul className="flex flex-col gap-2">
            {ambassadorResponsibilities.map(responsibility => (
              <li key={responsibility.id} className="flex gap-3 items-center">
                <Bullet />
                <span className="w-fit text-foreground">
                  <span className="font-bold">{responsibility.title}:</span>{' '}
                  {responsibility.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <SectionTab
          variant="secondary"
          sectionId="minimum-requirements"
          className="mb-6"
        >
          minimum requirements
        </SectionTab>
        <div>
          <ul className="flex flex-col gap-2">
            {ambassadorRequirements.map(requirement => (
              <li key={requirement.id} className="flex gap-3 items-center">
                <Bullet />
                <span className="w-fit text-foreground">
                  <span className="font-bold">{requirement.title}:</span>{' '}
                  {requirement.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="flex flex-col lg:flex-row gap-4">
        <Button
          variant="tertiary"
          className="font-mono uppercase text-sm lg:w-fit gap-3 cursor-pointer"
          onClick={() => {
            window.open('https://docs.google.com/forms/d/e/1FAIpQLSdBSiRzm2xBpMszB_9fBixJNyKdGnPMj99DtZbagHMdHgkGUg/viewform', '_blank', 'noopener,noreferrer');
          }}
        >
          <Bullet />
          Fill out your application ↗
        </Button>
        <Button
          variant="outline"
          className="font-mono uppercase text-sm lg:w-fit gap-3 cursor-pointer"
        >
          <Bullet />
          Join our discord ↗
        </Button>
      </section>
    </NoSidebarPageLayout>
  );
}
