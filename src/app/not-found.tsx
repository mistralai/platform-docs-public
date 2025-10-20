import { ArrowRightIcon } from '@/components/icons/pixel';
import NotFoundCat from '@/components/404';
import UsefullLinksSection from '@/components/sections/usefull-links';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PageContent from '@/components/layout/page-content';

export default function NotFound() {
  return (
    <div className="container mx-auto">
      <div className="flex h-full flex-col not-prose py-12">
        <NotFoundCat className="h-[calc(100vh-var(--header)-21rem)] mb-32">
          <Button asChild size="lg">
            <Link
              href="/"
              className="text-base sm:text-lg text-foreground/70 hover:text-foreground"
            >
              <span>Go back to Introduction</span>
              <ArrowRightIcon className="size-3.5" />
            </Link>
          </Button>
        </NotFoundCat>
        <UsefullLinksSection showTab={false} className="relative" />
      </div>
    </div>
  );
}
