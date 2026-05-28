import { Button } from '@/components/ui/button';
import { MenuIcon, XIcon } from 'lucide-react';
import { MobileHeaderLinks } from './header-links';
import { HeaderCta } from './cta';
import { ThemeToggle } from './theme-toggle';
import { LanguageDropdown } from './language-dropdown';
import { Suspense } from 'react';
import { DynamicStudioCta } from './dynamic-studio-cta';
import { getLingo } from '@/i18n/server';
import type { Locale } from '@/i18n/config';

export const MobileMenu = async ({ locale }: { locale: Locale }) => {
  const l = await getLingo(locale);
  return (
    <div className="bg-muted border-y border-border/50 pointer-events-auto group-data-[state=open]/menu-content:animate-menu-clip-in group-data-[state=closed]/menu-content:animate-menu-clip-out">
      <div className="p-sides flex flex-col gap-y-4">
        <Suspense>
          <MobileHeaderLinks />
        </Suspense>
        <HeaderCta href="https://mistral.ai/contact?utm_source=docs&utm_medium=header_cta&utm_campaign=studio_trial" size="lg" variant="secondary" target='_blank'>{l.text('Reach out', { context: 'Call to contact Mistral' })}</HeaderCta>
        <DynamicStudioCta size="lg" className='w-full' />
      </div>
      <div className="flex border-t mt-4 dark:bg-black/20 bg-black/5 border-border/50 py-6 justify-between items-center p-sides">
        <p>{l.text('Language', { context: 'Label above the language switcher in the mobile menu' })}</p>
        {/* The dropdown is portaled, so it must sit above the mobile dialog layer. */}
        <LanguageDropdown contentClassName="z-[10001]" />
      </div>
      <div className="flex border-t dark:bg-black/20 bg-black/5 border-border/50 py-6 justify-between items-center p-sides">
        <p>{l.text('Theme', { context: 'Label above the light/dark theme toggle in the mobile menu' })}</p>
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
