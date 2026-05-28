import ArrowRightIcon from '@/components/icons/pixel/arrow-right';
import {
  Heading,
  HeadingCTAs,
  HeadingSubtitle,
  HeadingTitle,
} from '@/components/layout/heading';
import { Bullet } from '@/components/ui/bullet';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation.client';
import { CardsAnimated } from './cards-animated';
import { CardData, modelAssets } from './assets';
import { MODEL_COLORS } from '@/lib/colors';
import { getLingo } from '@/i18n/server';
import type { Locale } from '@/i18n/config';

// Pre-computed deterministic grid indexes for initial cards (no Math.random())
const INITIAL_GRID_PATTERNS = [
  [0, 1, 2, 3, 1, 0, 3, 2, 2, 3, 0, 1], // Pattern for card 1
  [1, 2, 3, 0, 2, 1, 0, 3, 3, 0, 1, 2], // Pattern for card 2
  [2, 3, 0, 1, 3, 2, 1, 0, 0, 1, 2, 3], // Pattern for card 3
];

export default async function CookbookHeroSection({ locale }: { locale: Locale }) {
  const l = await getLingo(locale);
  // Generate initial cards on server-side (this runs during SSR)
  const initialCards: CardData[] = [
    {
      id: 1,
      title: l.text('Quick access to model recipes', { context: 'Short title for a featured cookbook topic' }),
      color: MODEL_COLORS.orange,
      models: modelAssets.slice(0, 4),
      gridPattern: INITIAL_GRID_PATTERNS[0],
    },
    {
      id: 2,
      title: l.text('Advanced AI capabilities', { context: 'Short title for a featured cookbook topic' }),
      color: MODEL_COLORS.red,
      models: modelAssets.slice(0, 4),
      gridPattern: INITIAL_GRID_PATTERNS[1],
    },
    {
      id: 3,
      title: l.text('Code generation tools', { context: 'Short title for a featured cookbook topic' }),
      color: MODEL_COLORS.yellow,
      models: modelAssets.slice(0, 4),
      gridPattern: INITIAL_GRID_PATTERNS[2],
    },
  ];
  return (
    <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-16 lg:pt-10 md:gap-10 mb-10">
      <Heading align="left">
        <div className="space-y-3">
          <HeadingTitle as="h1">{l.text('Mistral AI Cookbooks', { context: 'Main heading for the developer cookbooks page' })}</HeadingTitle>
          <HeadingSubtitle>
            {l.text('Discover Mistral AI technologies capabilities from basic tutorials to advanced use cases', { context: 'Introductory description of the developer cookbooks page' })}
          </HeadingSubtitle>
        </div>
        <HeadingCTAs>
          <Button variant="default" asChild>
            <Link
              target="_blank"
              href="https://github.com/mistralai/cookbook/blob/main/CONTRIBUTING_GUIDE.md"
            >
              {l.text('Contribute', { context: 'Call to contribute a developer cookbook' })}
              <ArrowRightIcon />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link
              target="_blank"
              href="https://discord.com/invite/mistralai"
              className="font-mono text-xs uppercase"
            >
              <Bullet />
              {l.text('Join our discord ↗', { context: 'Call to join the Mistral developer community on Discord' })}
            </Link>
          </Button>
        </HeadingCTAs>
      </Heading>

      {/* Interactive content placeholder */}
      {/* <div className="flex justify-between items-center">
        <div className="flex-1" />
        <div className="w-80 h-64 bg-red-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-semibold">
            Interactive Content Placeholder
          </span>
        </div>
      </div> */}

      <CardsAnimated initialCards={initialCards} />
    </section>
  );
}
