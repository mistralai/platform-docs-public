'use client';

import { PageIcon } from '@/components/icons/pixel';
import { MODEL_COLORS } from '@/lib/colors';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { CardData, modelAssets } from './assets';

type CardPosition = 'front' | 'middle' | 'back';

const cardColors = [MODEL_COLORS.orange, MODEL_COLORS.red, MODEL_COLORS.yellow];

const cardTitles = [
  'Quick access to model recipes',
  'Advanced AI capabilities',
  'Code generation tools',
  'Language understanding',
  'Creative writing assistant',
  'Data analysis helper',
];

const generateRandomCard = (id: number, colorIndex: number) => {
  const shuffledModels = [...modelAssets].sort(() => Math.random() - 0.5);
  const title = cardTitles[Math.floor(Math.random() * cardTitles.length)];

  return {
    id,
    title,
    color: cardColors[colorIndex % cardColors.length],
    models: shuffledModels.slice(0, 4),
  };
};

interface CardsAnimatedProps {
  initialCards: CardData[];
}

export const CardsAnimated = ({ initialCards }: CardsAnimatedProps) => {
  const [cards, setCards] = useState(() => {
    return initialCards;
  });
  const [cardIdCounter, setCardIdCounter] = useState(4);
  const [colorIndex, setColorIndex] = useState(3);

  const advanceToNext = () => {
    setCards(prevCards => {
      const newCards = [...prevCards.slice(1)];
      const newCard = generateRandomCard(cardIdCounter, colorIndex);
      newCards.push(newCard);

      setCardIdCounter(prev => prev + 1);
      setColorIndex(prev => prev + 1);
      return newCards;
    });
  };

  useEffect(() => {
    const interval = setInterval(advanceToNext, 5000);
    return () => clearInterval(interval);
  }, [cardIdCounter, colorIndex]);

  const positions: CardPosition[] = ['front', 'middle', 'back'];

  return (
    <div className="grid place-content-center">
      <div
        className="relative h-[350px] w-[350px] md:w-[350px] lg:w-[400px] cursor-pointer"
        onClick={advanceToNext}
      >
        <AnimatePresence>
          {cards.map((card, index) => (
            <Card key={card.id} card={card} position={positions[index]} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

interface CardProps {
  card: CardData;
  position: CardPosition;
}

const Card = ({ card, position }: CardProps) => {
  const x = position === 'front' ? '0%' : position === 'middle' ? '5%' : '10%';
  const y = position === 'front' ? '0%' : position === 'middle' ? '5%' : '10%';
  const scale = position === 'front' ? 1 : position === 'middle' ? 0.98 : 0.95;
  const zIndex = position === 'front' ? 10 : position === 'middle' ? 5 : 2;

  const rows = 3;
  const cols = 4;

  const indexes = useMemo(() => {
    // Use pre-computed pattern for initial cards, generate for others
    if (card.gridPattern) {
      return card.gridPattern;
    }
    return makeNonRepeatingGridIndexes(card.models.length, rows, cols);
  }, [card.id, card.models, card.gridPattern]);
  return (
    <motion.div
      className="absolute left-0 top-0 w-fit select-none"
      style={{
        border: `1px solid ${card.color}`,
      }}
      initial={{
        x: '15%',
        y: '15%',
        scale: 0.9,
        opacity: 0,
        zIndex,
      }}
      animate={{
        x,
        y,
        scale,
        opacity: 1,
        zIndex,
      }}
      exit={{
        x: '-10%',
        y: '-10%',
        scale: 1.05,
        opacity: 0,
        zIndex: 20,
      }}
      transition={{
        duration: 0.5,
        ease: [0.65, 0, 0.35, 1],
      }}
    >
      <header
        className="px-2 py-1.5 text-sm font-mono uppercase flex items-center gap-2 font-semibold"
        style={{
          backgroundColor: card.color,
        }}
      >
        <PageIcon className="size-4" />
        {card.title}
      </header>

      <div className="grid grid-cols-4 gap-6 px-10 py-6 bg-background">
        {indexes.map((modelIdx, i) => {
          const m = card.models[modelIdx];
          return (
            <div key={i}>
              <Image
                src={m.src}
                alt={m.alt}
                width={100}
                height={100}
                className="grayscale h-16 w-auto pointer-events-none"
              />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

// Pick a model index for each cell so that no two orthogonally adjacent cells match
function makeNonRepeatingGridIndexes(
  modelsCount: number,
  rows: number,
  cols: number
) {
  const grid: number[] = new Array(rows * cols).fill(0);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;

      // Build candidate list [0..modelsCount-1]
      const candidates = Array.from({ length: modelsCount }, (_, k) => k);

      // Exclude left neighbor
      if (c > 0) {
        const left = grid[i - 1];
        const idx = candidates.indexOf(left);
        if (idx !== -1) candidates.splice(idx, 1);
      }

      // Exclude top neighbor
      if (r > 0) {
        const top = grid[i - cols];
        const idx = candidates.indexOf(top);
        if (idx !== -1) candidates.splice(idx, 1);
      }

      // Choose a candidate (deterministic for initial cards, random for others)
      if (candidates.length === 0) {
        // Shouldn't happen with >=2 models, but be defensive
        const avoid = new Set<number>();
        if (c > 0) avoid.add(grid[i - 1]);
        if (r > 0) avoid.add(grid[i - cols]);

        let pick = 0;
        while (avoid.has(pick) && pick < modelsCount) pick++;
        grid[i] = pick % modelsCount;
      } else {
        const pick = Math.floor(Math.random() * candidates.length);
        grid[i] = candidates[pick];
      }
    }
  }

  return grid;
}
