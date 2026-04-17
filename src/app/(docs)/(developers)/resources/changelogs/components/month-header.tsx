'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface MonthHeaderProps {
  month: string;
}

function convertToShortMonth(monthYear: string): string {
  try {
    const [monthName, year] = monthYear.split(' ');

    const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();
    const shortMonth = new Date(2000, monthIndex).toLocaleDateString('en-US', {
      month: 'short',
    });

    return `${shortMonth} ${year}`;
  } catch (error) {
    return monthYear;
  }
}

export function MonthHeader({ month }: MonthHeaderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start 60%', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  const shortMonth = convertToShortMonth(month);

  return (
    <div ref={scrollRef} className="sticky top-20">
      <motion.h3
        style={{
          opacity,
        }}
        className={cn(
          'text-sm font-semibold text-primary font-mono uppercase tracking-wide !my-0 text-right pt-1 pr-4'
        )}
      >
        {shortMonth}
      </motion.h3>
    </div>
  );
}
