import { ModelsCatalogPage } from './models-catalog-page';

export default async function ModelsPage(props: {
  params: Promise<{ locale: string }>;
}) {
  return <ModelsCatalogPage {...props} />;
}
