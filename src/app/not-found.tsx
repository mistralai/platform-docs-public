import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import PageContent from '@/components/layout/page-content';
import { Providers } from '@/components/providers';
import { sfMono } from '@/lib/font';
import { locales, type Locale } from '@/i18n/config';
import { ClientLocaleSelect } from '@/i18n/navigation.client';
import { getLingo } from '@/i18n/server';
import NotFoundCat from '@/components/404';
import { ArrowRightIcon } from '@/components/icons/pixel';
import { Button } from '@/components/ui/button';
import Link from '@/i18n/navigation.client';

export default function NotFound() {
  return (
    <html lang="en" className={sfMono.variable}>
      <body suppressHydrationWarning>
        <ClientLocaleSelect
          variants={locales.map(locale => ({ locale, children: <NotFoundContent locale={locale} /> }))}
        />
      </body>
    </html>
  );
}

async function NotFoundContent({ locale }: { locale: Locale }) {
  const l = await getLingo(locale);

  return (
    <Providers locale={locale}>
      <div data-vaul-drawer-wrapper="true">
        <Header locale={locale} />
        <PageContent
          isRoot
          as="div"
          className="overflow-hidden max-lg:overflow-y-auto h-[calc(100dvh-var(--header))] rounded-b-none"
        >
          <div className="max-w-[1920px] w-full mx-auto">
            <div className="container mx-auto">
              <div className="flex h-full flex-col not-prose py-12">
                <NotFoundCat
                  className="h-[calc(100vh-var(--header)-21rem)] mb-32"
                  title={l.text('¿Meow? Page not found.', { context: 'Playful not-found page heading' })}
                  description={l.text('The page you’re looking for was either moved or doesn’t exist.', { context: 'Explanation that the requested page does not exist' })}
                  imageAlt={l.text('Not Found', { context: 'Alt text for the not-found illustration' })}
                >
                  <Button asChild size="lg">
                    <Link
                      href="/"
                      className="text-base sm:text-lg text-foreground/70 hover:text-foreground"
                    >
                      <span>{l.text('Go back to Introduction', { context: 'Call to go back to the documentation home page' })}</span>
                      <ArrowRightIcon className="size-3.5" />
                    </Link>
                  </Button>
                </NotFoundCat>
              </div>
            </div>
          </div>
          <Footer locale={locale} />
        </PageContent>
      </div>
    </Providers>
  );
}
