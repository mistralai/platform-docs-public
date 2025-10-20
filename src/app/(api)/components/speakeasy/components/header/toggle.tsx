'use client';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import React from 'react';

export default function LightToggle({
  className,
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return (
    <button
      aria-label="Toggle theme"
      role="switch"
      className={cn(
        'absolute bottom-27.5 right-15.5 w-14 h-8 rounded-t-full rounded-b-sm dark:mix-blend-overlay group flex items-center justify-center',
        'focus-visible:bg-ring dark:focus-visible:bg-foreground focus-visible:ring-transparent focus-visible:outline-none',
        'after:content-[""] after:absolute after:-inset-2',

        className
      )}
      onClick={toggleTheme}
      {...props}
    >
      <span className="absolute text-center z-10 opacity-0 group-hover:opacity-100 transition-[transform,translate,opacity] duration-300 ease-out -translate-y-5 group-hover:-translate-y-8 text-xs !leading-[.92] font-mono uppercase font-bold">
        Toggle theme
      </span>
    </button>
  );
}
