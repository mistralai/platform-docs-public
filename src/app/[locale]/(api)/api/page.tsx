import { Metadata } from 'next';
import { resolveContentLocale } from '@/lib/content/locale-content';
import type { Locale } from '@/i18n/config';
import { getLingo } from '@/i18n/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const l = await getLingo(locale);
  const title = l.text('API Specs', { context: 'Page title for API specifications' });
  const description = l.text('Complete Mistral AI API Specifications', { context: 'Meta description for API specifications' });
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: '/api/og?type=generic&eyebrow=API Specs&title=API Specs&description=Complete Mistral AI API Specifications',
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [
        '/api/og?type=generic&eyebrow=API Specs&title=API Specs&description=Complete Mistral AI API Specifications',
      ],
    },
  };
}

export default async function ApiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const effective = resolveContentLocale(locale, 'api/endpoint', 'chat');
  const mod = await loadChatPage(effective);
  const ChatPage = mod.default;
  return <ChatPage />;
}

async function loadChatPage(locale: Locale) {
  switch (locale) {
    case 'en':
      return import('@/content/en/api/endpoint/chat/page.mdx');
    case 'fr':
      return import('@/content/fr/api/endpoint/chat/page.mdx');
    default:
      return locale satisfies never;
  }
}
