import { Metadata } from 'next';
import { getOGImageUrl } from '@/components/og/helpers';
import { OG_IMAGE_DIMENSIONS } from '@/lib/constants';
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
  const ogImageUrl = getOGImageUrl({
    path: 'generic',
    eyebraw: title,
    title,
    description,
    image: '/ogs/docs.png',
  });
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: OG_IMAGE_DIMENSIONS.width,
          height: OG_IMAGE_DIMENSIONS.height,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
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
