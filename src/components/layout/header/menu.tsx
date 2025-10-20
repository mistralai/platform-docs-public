import { Button } from '@/components/ui/button';
import { MenuIcon, XIcon } from 'lucide-react';
import { MobileHeaderLinks } from './header-links';
import { HeaderCta } from './cta';
import { ThemeToggle } from './theme-toggle';
import { Suspense } from 'react';

export const MobileMenu = () => {
  return (
    <div className="bg-muted border-y border-border/50 pointer-events-auto group-data-[state=open]/menu-content:animate-menu-clip-in group-data-[state=closed]/menu-content:animate-menu-clip-out">
      <div className="p-sides flex flex-col gap-y-4">
        <Suspense>
          <MobileHeaderLinks />
        </Suspense>
        <HeaderCta className="w-full" size="lg" />
      </div>
      <div className="flex border-t mt-4 dark:bg-black/20 bg-black/5 border-border/50 py-6 justify-between items-center p-sides">
        <p>Theme</p>
        <ThemeToggle />
      </div>
    </div>
  );
};

export const MobileMenuButton = () => {
  return (
    <Button className="group" size="sm">
      <MenuIcon className="group-data-[state=open]:hidden size-5" />
      <XIcon className="group-data-[state=closed]:hidden size-5" />
    </Button>
  );
};
