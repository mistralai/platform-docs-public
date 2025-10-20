import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Providers } from '@/components/providers';
import localFont from 'next/font/local';
import PageContent from '@/components/layout/page-content';
import { GoogleTagManager } from '@next/third-parties/google';

export const metadata: Metadata = {
  title: 'Mistral AI',
  description:
    "Documentation for the deployment and usage of Mistral AI's LLMs",
};

const sfMono = localFont({
  src: [
    {
      path: '../../public/fonts/sf-mono-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/sf-mono-regularitalic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/sf-mono-medium.woff2',
      weight: '500',
      style: 'medium',
    },
    {
      path: '../../public/fonts/sf-mono-mediumitalic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../public/fonts/sf-mono-semibold.woff2',
      weight: '600',
      style: 'semibold',
    },
    {
      path: '../../public/fonts/sf-mono-semibolditalic.woff2',
      weight: '600',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-sf-mono',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      lang="en"
      className={`${sfMono.variable}`}
      suppressHydrationWarning
      data-selected-language="typescript"
    >
      <head>
        <GoogleTagManager gtmId="GTM-N34CP63L" />
        <script dangerouslySetInnerHTML={{ __html: setLanguageScript }} />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <div data-vaul-drawer-wrapper="true">
            <Header />
            {/* Mobile Page Content */}
            <PageContent
              isRoot
              as="div"
              className="overflow-hidden max-lg:overflow-y-auto h-[calc(100dvh-var(--header))] rounded-b-none"
            >
              <div className="max-w-[1920px] w-full mx-auto">{children}</div>
              <Footer />
            </PageContent>
          </div>
        </Providers>
      </body>
    </html>
  );
}
