'use client';
import React, { useState, useEffect } from 'react';
import { Marquee } from '@joycostudio/marquee/react';
import { cn } from '@/lib/utils';
import MistralFlower from '@/components/icons/assets/mistral-flower';
import Image from 'next/image';

const propsConfig: PropsBackgroundSection[] = [
  {
    distribution: 'between',
    items: [
      {
        type: 'group',
        items: [{ type: 'flowerSet' }, { type: 'grass' }],
      },
      { type: 'grass' },
    ],
  },
  {
    distribution: 'even',
    items: [
      { type: 'flower', color: 'pink' },
      { type: 'grassSet' },
      { type: 'flower', color: 'red' },
      { type: 'grass' },
    ],
  },
  {
    distribution: 'between',
    items: [
      { type: 'flowerSet' },
      {
        type: 'group',
        items: [{ type: 'grass' }, { type: 'flower', color: 'yellow' }],
      },
    ],
  },
  {
    distribution: 'even',
    items: [
      { type: 'grass' },
      { type: 'flower', color: 'pink' },
      { type: 'grassSet' },
      { type: 'flower', color: 'red' },
      { type: 'grass' },
    ],
  },
  {
    distribution: 'between',
    items: [
      { type: 'flowerSet' },
      { type: 'grassSet' },
      { type: 'flower', color: 'yellow' },
    ],
  },
];

const GrassGround = ({
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      data-footer-ground
      className={cn('w-full relative animate-ground-scroll', className)}
      style={
        {
          '--bg-size': '64px',
          animationPlayState: 'paused',
          backgroundImage: 'url(/assets/sprites/ground_tile.png)',
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'var(--bg-size) var(--bg-size)',
          backgroundPosition: '0 bottom',
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

const useWindowWidth = () => {
  const [width, setWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 0;
  });

  useEffect(() => {
    setWidth(window.innerWidth);

    window.addEventListener('resize', () => {
      setWidth(window.innerWidth);
    });
    return () => {
      window.removeEventListener('resize', () => {
        setWidth(window.innerWidth);
      });
    };
  }, []);

  return width;
};

export default function AnimatedGround() {
  const width = useWindowWidth();

  const getSpeed = () => {
    if (width > 1024) {
      return 21.33;
    }

    if (width > 768) {
      return 15.66;
    }

    return 11.66;
  };

  return (
    <div className="relative h-36 md:h-54 lg:h-60 isolate w-full flex flex-col justify-end dark:brightness-50">
      {/* Animated props background sections */}
      <Sun />

      <Marquee
        speed={getSpeed()}
        onReady={() => {
          const ground = document.querySelectorAll('[data-footer-ground]');

          ground.forEach(g => {
            if (g instanceof HTMLElement) {
              g.style.animationPlayState = 'running';
            }
          });
        }}
        speedFactor={1}
        direction={1}
        play={true}
      >
        <div className="relative">
          <div className="flex whitespace-nowrap">
            {propsConfig.map((section, index) => (
              <div key={index} className="w-screen h-24 flex items-end">
                <PropsBackgroundSection {...section} />
              </div>
            ))}
          </div>
        </div>
      </Marquee>

      {/* Animated grass ground */}
      <GrassGround className="h-16 hidden lg:block" />
      <GrassGround
        className="h-12 hidden md:max-lg:block"
        style={{ '--bg-size': '48px' } as React.CSSProperties}
      />
      <GrassGround
        className="h-9 md:hidden"
        style={{ '--bg-size': '36px' } as React.CSSProperties}
      />
      <AnimatedCat />
    </div>
  );
}

const Sun = () => {
  return (
    <div className="absolute size-60 md:size-140 translate-y-1/2 -translate-x-1/2 left-1/2 bottom-16 z-0 dark:opacity-0">
      <Image
        src="/assets/sprites/sun.gif"
        unoptimized
        alt="Sun"
        width={224}
        height={224}
        className="size-full pixelated"
      />
    </div>
  );
};

const AnimatedCat = () => {
  return (
    <div className="size-28 md:size-40 lg:size-48 absolute left-1/12 md:left-1/6 lg:left-1/3 -bottom-px md:-bottom-1 lg:bottom-px z-0">
      <Image
        src="/assets/sprites/cat-walking-white.gif"
        unoptimized
        alt="Cat"
        className="pixelated"
        width={224}
        height={224}
      />
    </div>
  );
};

// Item types
type FlowerColor = 'pink' | 'red' | 'yellow';

interface FlowerItem {
  type: 'flower';
  color: FlowerColor;
}

interface FlowerSetItem {
  type: 'flowerSet';
}

interface GrassItem {
  type: 'grass';
}

interface GrassSetItem {
  type: 'grassSet';
}

interface GroupItem {
  type: 'group';
  items: BackgroundItem[];
}

type BackgroundItem =
  | FlowerItem
  | FlowerSetItem
  | GrassItem
  | GrassSetItem
  | GroupItem;

interface PropsBackgroundSection {
  distribution: 'even' | 'between';
  items: BackgroundItem[];
}

// Renderers for each item type
const renderFlower = (color: FlowerColor) => {
  const colorClasses = {
    pink: 'text-[#FF91DC]',
    red: 'text-[#FA5111]',
    yellow: 'text-[#F9D749]',
  };

  return (
    <MistralFlower
      key={`flower-${color}-${Math.random()}`}
      className={cn(
        'size-12 md:size-14 lg:size-16 shrink-0',
        colorClasses[color]
      )}
    />
  );
};

const renderFlowerSet = () => (
  <div key={`flowerset-${Math.random()}`} className="flex gap-4">
    {renderFlower('pink')}
    {renderFlower('red')}
    {renderFlower('yellow')}
  </div>
);

const renderGrass = () => (
  <Image
    key={`grass-${Math.random()}`}
    src="/assets/sprites/grass_tile.png"
    alt="Grass"
    width={224}
    height={224}
    className="size-12 md:size-14 lg:size-16 pixelated"
  />
);

const renderGrassSet = () => (
  <div key={`grassset-${Math.random()}`} className="flex gap-2">
    {renderGrass()}
    {renderGrass()}
    {renderGrass()}
  </div>
);

const renderItem = (item: BackgroundItem): React.ReactNode => {
  switch (item.type) {
    case 'flower':
      return renderFlower(item.color);
    case 'flowerSet':
      return renderFlowerSet();
    case 'grass':
      return renderGrass();
    case 'grassSet':
      return renderGrassSet();
    case 'group':
      return (
        <div key={`group-${Math.random()}`} className="flex gap-2 items-end">
          {item.items.map(renderItem)}
        </div>
      );
    default:
      return null;
  }
};

const PropsBackgroundSection = ({
  distribution,
  items,
}: PropsBackgroundSection) => {
  return (
    <div
      className={cn(
        'flex w-full items-end px-20',
        distribution === 'even' ? 'justify-evenly' : 'justify-between'
      )}
    >
      {items.map(renderItem)}
    </div>
  );
};
