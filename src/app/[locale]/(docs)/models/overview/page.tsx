import { ModelsCatalogPage } from '../models-catalog-page';

export default async function ModelsOverviewPage(props: {
  params: Promise<{ locale: string }>;
}) {
  return <ModelsCatalogPage {...props} introVariant="overview" />;
}
