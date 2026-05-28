import type { Metadata } from 'next';
import { locales, type Locale } from '@/i18n/config';
import { getLingo } from '@/i18n/server';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Providers } from '@/components/providers';
import PageContent from '@/components/layout/page-content';
import { GoogleTagManager } from '@next/third-parties/google';
import { sfMono } from '@/lib/font';

export const dynamicParams = false;
export const dynamic = 'force-static';

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const l = await getLingo(locale);
  return {
    title: l.text('Mistral AI', { context: 'Default page title for the documentation site' }),
    description: l.text("Documentation for the deployment and usage of Mistral AI's LLMs", { context: 'Default meta description for the documentation site' }),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const setLanguageScript = `
    (function() {
      try {
        var key = 'speakeasy-api-selected-language';
        var lang = localStorage.getItem(key);
        if (!lang || lang === 'null' || lang === 'undefined' || lang === '') {
          lang = 'typescript';
          localStorage.setItem(key, lang);
          console.log('Setting language to', lang);
        }
        document.documentElement.dataset.selectedLanguage = lang;
        window.API_SELECTED_LANGUAGE = lang;
        console.log('Setting language to', lang);
      } catch (e) {}
    })();
  `;

  return (
    <html
      lang={locale}
      className={sfMono.variable}
      suppressHydrationWarning
      data-selected-language="typescript"
    >
      <head>
        <GoogleTagManager gtmId="GTM-N34CP63L" />
        <script dangerouslySetInnerHTML={{ __html: setLanguageScript }} />
      </head>
      <body suppressHydrationWarning>
        <Providers locale={locale}>
          <div data-vaul-drawer-wrapper="true">
            <Header locale={locale} />
            {/* Mobile Page Content */}
            <PageContent
              isRoot
              as="div"
              className="overflow-hidden max-lg:overflow-y-auto h-[calc(100dvh-var(--header))] rounded-b-none"
            >
              <div className="max-w-[1920px] w-full mx-auto">{children}</div>
              <Footer locale={locale} />
            </PageContent>
          </div>
        </Providers>
      </body>
    </html>
  );
}
