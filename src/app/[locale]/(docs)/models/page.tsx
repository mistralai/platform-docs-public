import type { Metadata } from 'next';
import { getOGImageUrl } from '@/components/og/helpers';
import { OG_IMAGE_DIMENSIONS } from '@/lib/constants';
import { getLingo } from '@/i18n/server';
import type { Locale } from '@/i18n/config';
import { ModelsCatalogPage } from './models-catalog-page';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const l = await getLingo(locale);
  const title = l.text('Models Overview', { context: 'Main heading for the page listing all AI models' });
  const description = l.text('Mistral develops, or makes available, open-weight and commercial large language models. Explore the full lineup, compare benchmarks, and find the right model for your use case.', { context: 'Introductory description of Mistral AI models' });
  const ogImageUrl = getOGImageUrl({
    path: 'generic',
    eyebraw: 'MODELS',
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
          alt: title,
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

export default async function ModelsPage(props: {
  params: Promise<{ locale: string }>;
}) {
  return <ModelsCatalogPage {...props} />;
}
