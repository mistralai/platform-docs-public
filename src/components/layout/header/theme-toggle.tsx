'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { KeyboardKey } from '@/components/ui/keyboard-key';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  // Handle keyboard shortcut for theme toggle
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 't' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [theme, toggleTheme]);

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      className="relative overflow-hidden border border-border bg-border/50 px-1 gap-0 pointer-events-auto group hover:!bg-border/50"
    >
      {/* Keyboard key positioned as background of active theme */}
      <KeyboardKey
        size="lg"
        className="absolute left-1 size-7 pointer-events-none z-0 transition-transform duration-500 translate-x-0 dark:translate-x-full"
      ></KeyboardKey>

      {/* Theme icons */}
      <div className="size-8 z-10 flex items-center justify-center transition-opacity duration-300 dark:opacity-50 pointer-events-auto">
        <Sun className="size-4" />
      </div>
      <div className="size-8 z-10 flex items-center justify-center transition-opacity duration-300 opacity-50 dark:opacity-100 pointer-events-auto">
        <Moon className="size-4" />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
