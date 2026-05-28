'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useLingo } from '@lingo.dev/react';

interface MonthHeaderProps {
  date: string;
}

export function MonthHeader({ date }: MonthHeaderProps) {
  const l = useLingo();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start 60%', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  const shortMonth = l.date(new Date(date), {
    dateStyle: undefined,
    month: 'short',
    year: '2-digit',
  });

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
