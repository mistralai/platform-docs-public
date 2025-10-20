import type { Metadata } from 'next';
import { getOGImageUrl } from '@/components/og/helpers';

const ogImageUrl = getOGImageUrl({
  path: 'generic',
  eyebraw: 'AMBASSADOR',
  title: 'Ambassadors',
  description: 'Welcome our community of AI advocates and leaders',
  image: '/ogs/ambassadors.png',
});

const title = 'Ambassadors - Mistral AI';
const description =
  'Join our community of AI advocates and leaders. Apply to become a Mistral AI Ambassador and help grow our global AI community.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [ogImageUrl],
  },
  twitter: {
    card: 'summary_large_image',
    images: [ogImageUrl],
  },
};