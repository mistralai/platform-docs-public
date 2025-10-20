import ArrowRightIcon from '@/components/icons/pixel/arrow-right';
import {
  Heading,
  HeadingCTAs,
  HeadingSubtitle,
  HeadingTitle,
} from '@/components/layout/heading';
import { Bullet } from '@/components/ui/bullet';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CardsAnimated } from './cards-animated';
import { CardData, modelAssets } from './assets';
import { MODEL_COLORS } from '@/lib/colors';

// Pre-computed deterministic grid indexes for initial cards (no Math.random())
const INITIAL_GRID_PATTERNS = [
  [0, 1, 2, 3, 1, 0, 3, 2, 2, 3, 0, 1], // Pattern for card 1
  [1, 2, 3, 0, 2, 1, 0, 3, 3, 0, 1, 2], // Pattern for card 2
  [2, 3, 0, 1, 3, 2, 1, 0, 0, 1, 2, 3], // Pattern for card 3
];

// Server-side function to generate initial cards (call this on the server)
export const generateServerInitialCards = (): CardData[] => {
  return [
    {
      id: 1,
      title: 'Quick access to model recipes',
      color: MODEL_COLORS.orange,
      models: modelAssets.slice(0, 4),
      gridPattern: INITIAL_GRID_PATTERNS[0],
    },
    {
      id: 2,
      title: 'Advanced AI capabilities',
      color: MODEL_COLORS.red,
      models: modelAssets.slice(0, 4),
      gridPattern: INITIAL_GRID_PATTERNS[1],
    },
    {
      id: 3,
      title: 'Code generation tools',
      color: MODEL_COLORS.yellow,
      models: modelAssets.slice(0, 4),
      gridPattern: INITIAL_GRID_PATTERNS[2],
    },
  ];
};

export default function CookbookHeroSection() {
  // Generate initial cards on server-side (this runs during SSR)
  const initialCards = generateServerInitialCards();
  return (
    <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-16 lg:pt-10 md:gap-10 mb-10">
      <Heading align="left">
        <div className="space-y-3">
          <HeadingTitle as="h1">Mistral AI Cookbooks</HeadingTitle>
          <HeadingSubtitle>
            Discover Mistral AI technologies capabilities from basic tutorials to advanced use cases
          </HeadingSubtitle>
        </div>
        <HeadingCTAs>
          <Button variant="default" asChild>
            <Link
              target="_blank"
              href="https://github.com/mistralai/cookbook/blob/main/CONTRIBUTING.md"
            >
              Contribute
              <ArrowRightIcon />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link
              target="_blank"
              href="https://github.com/mistralai/cookbook/blob/main/CONTRIBUTING.md"
              className="font-mono text-xs uppercase"
            >
              <Bullet />
              Join our discord ↗
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
