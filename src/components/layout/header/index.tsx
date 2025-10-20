import DesktopHeaderLinks from './header-links';
import { ThemeToggle } from '@/components/layout/header/theme-toggle';
import { SearchInput } from '@/components/layout/sidebar/search-input';
import {
  MobileMenuProvider,
  MobileMenuTrigger,
  MobileMenuContent,
  MobileMenuClose,
} from '@/components/layout/mobile-menu';
import { MobileMenu, MobileMenuButton } from './menu';
import { HeaderCta } from './cta';
import { BrandProductDropdown } from './brand-dropdown';
import MistralLogoSolid from '@/components/icons/assets/mistral-logo-solid';

export default function Header() {
  return (
    <MobileMenuProvider>
      <header className="flex items-center sticky top-0 h-header z-100 max-w-[1920px] px-sides w-full mx-auto pointer-events-none gap-">
        <div className="lg:w-[calc(var(--sidebar-width)-var(--sides))]">
          <div className="flex items-center gap-2">
            <BrandProductDropdown>
              <span className="size-8 flex items-center justify-center bg-foreground/10 rounded-md hover:bg-foreground/20 transition-colors">
                <MistralLogoSolid className="size-4 w-auto" />
              </span>
            </BrandProductDropdown>
          </div>
        </div>
        {/* Mobile Header Content */}
        <div className="flex-1 justify-end gap-2 h-full flex items-center lg:hidden pointer-events-auto shrink">
          <MobileMenuClose asChild>
            <div className="max-w-40 w-full">
              <SearchInput />
            </div>
          </MobileMenuClose>
          <MobileMenuTrigger asChild>
            <MobileMenuButton />
          </MobileMenuTrigger>
        </div>
        {/* Desktop Header Content */}
        <div className="hidden flex-1 px-2 lg:flex items-center justify-between">
          <DesktopHeaderLinks />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <HeaderCta className="pointer-events-auto" />
          </div>
        </div>
      </header>

      <MobileMenuContent>
        <MobileMenu />
      </MobileMenuContent>
    </MobileMenuProvider>
  );
}
