import { permanentRedirect } from '@/i18n/navigation.server';
import { findModelBySlugAlias } from '@/schema';
import type { Locale } from '@/i18n/config';

export {
  generateStaticParams,
  dynamicParams,
  generateMetadata,
} from '../../../model-card/[slug]/model-page';

export default async function OldModelCardPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  const aliasModel = findModelBySlugAlias(slug);
  permanentRedirect(`/models/${aliasModel?.slug ?? slug}`, locale);
}
