'use client';

import { Link } from '@/i18n/navigation.client';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PRODUCT_LOGOS } from '@/schema/content/getting-started';
import { useState, useRef, useCallback } from 'react';
import { useLingo } from '@lingo.dev/react';

const UNHOVER_DELAY = 100;

export function HeroCards() {
  const l = useLingo();
  const CARDS = [
    {
      id: 'vibe',
      title: 'Vibe',
      href: '/vibe/overview',
      logo: '/assets/logos/m-white.svg',
      color: 'bg-[#FA500F]',
      rotation: '-rotate-[15deg]',
      translate: '-translate-x-20 translate-y-4',
      zIndex: 'z-10',
    },
    {
      id: 'studio',
      title: 'Studio',
      href: '/studio-api/overview',
      logo: '/assets/logos/m-white.svg',
      color: 'bg-[#0082E6]',
      rotation: '-rotate-[5deg]',
      translate: '-translate-x-8',
      zIndex: 'z-20',
    },
    {
      id: 'models',
      title: l.text('Models', { context: 'Label for AI models' }),
      href: '/models',
      logo: '/assets/logos/m-white.svg',
      color: 'bg-[#6F6F84]',
      rotation: 'rotate-[5deg]',
      translate: 'translate-x-8 -translate-y-2',
      zIndex: 'z-30',
    },
    {
      id: 'admin',
      title: l.text('Admin', { context: 'Name of the Mistral admin console' }),
      href: '/admin/set-up-organization/create-organization',
      logo: '/assets/logos/m-white.svg',
      color: 'bg-[#4a4a5e]',
      rotation: 'rotate-[15deg]',
      translate: 'translate-x-20 translate-y-6',
      zIndex: 'z-40',
    },
  ];
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isGroupHovered, setIsGroupHovered] = useState(false);
  const cardTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const groupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCardEnter = useCallback((id: string) => {
    if (cardTimers.current[id]) clearTimeout(cardTimers.current[id]);
    setHoveredCard(id);
  }, []);

  const handleCardLeave = useCallback((id: string) => {
    cardTimers.current[id] = setTimeout(() => {
      setHoveredCard(prev => prev === id ? null : prev);
    }, UNHOVER_DELAY);
  }, []);

  const handleGroupEnter = useCallback(() => {
    if (groupTimer.current) clearTimeout(groupTimer.current);
    setIsGroupHovered(true);
  }, []);

  const handleGroupLeave = useCallback(() => {
    groupTimer.current = setTimeout(() => {
      setIsGroupHovered(false);
    }, UNHOVER_DELAY);
  }, []);

  return (
    <div className="relative flex items-center justify-center w-full max-w-md h-64 md:h-72 perspective-[2000px] mt-8 md:mt-0">
      <div
        className={cn(
          'relative w-full h-full flex items-center justify-center transition-transform duration-700 ease-out',
          isGroupHovered && 'scale-[1.03]'
        )}
        onMouseEnter={handleGroupEnter}
        onMouseLeave={handleGroupLeave}
      >
        {CARDS.map((card, idx) => {
          const isActive = hoveredCard === card.id;

          return (
            <Link
              key={card.id}
              href={card.href}
              onMouseEnter={() => handleCardEnter(card.id)}
              onMouseLeave={() => handleCardLeave(card.id)}
              className={cn(
                'absolute block w-32 h-44 rounded-2xl border-[3px] shadow-xl',
                'flex items-center justify-center cursor-pointer',
                card.color,
                isActive ? 'z-50 border-white shadow-2xl' : cn(card.zIndex, 'border-white/60'),
                // Base position
                !isGroupHovered && !isActive && card.rotation,
                !isGroupHovered && !isActive && card.translate,
                // Fan out on group hover
                isGroupHovered && !isActive && idx === 0 && '-translate-x-[120px] -rotate-[18deg]',
                isGroupHovered && !isActive && idx === 1 && '-translate-x-[42px] -rotate-[6deg]',
                isGroupHovered && !isActive && idx === 2 && 'translate-x-[42px] rotate-[6deg]',
                isGroupHovered && !isActive && idx === 3 && 'translate-x-[120px] rotate-[18deg]',
                // Active card pops up
                isActive && isGroupHovered && idx === 0 && '-translate-x-[120px] scale-[1.2] rotate-0',
                isActive && isGroupHovered && idx === 1 && '-translate-x-[42px] scale-[1.2] rotate-0',
                isActive && isGroupHovered && idx === 2 && 'translate-x-[42px] scale-[1.2] rotate-0',
                isActive && isGroupHovered && idx === 3 && 'translate-x-[120px] scale-[1.2] rotate-0',
                isActive && !isGroupHovered && 'scale-[1.2] rotate-0',
              )}
              style={{
                transformOrigin: 'bottom center',
                transition: 'translate 750ms cubic-bezier(0.16, 1, 0.3, 1), rotate 750ms cubic-bezier(0.16, 1, 0.3, 1), scale 750ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 750ms cubic-bezier(0.16, 1, 0.3, 1), border-color 250ms ease',
              }}
            >
              <Image src={card.logo} alt={card.title} width={80} height={80} className="w-20 h-20 drop-shadow-md rounded-xl" priority />

              {/* Tooltip */}
              <div
                className={cn(
                  'absolute pointer-events-none bg-foreground text-background text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg',
                  isActive ? 'opacity-100 scale-100 -bottom-10' : 'opacity-0 scale-95 -bottom-8'
                )}
                style={{ transition: 'all 500ms cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                {card.title}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
