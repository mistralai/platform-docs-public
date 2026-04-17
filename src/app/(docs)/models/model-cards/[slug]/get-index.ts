import { uniqueHeadingId } from '@/lib/heading-utils';
import { getModelSlug, getModelUrl, models } from '@/schema';
import { Doc } from '@/schema/doc';

export const getIndex = () => {
  let used = new Set<string>();
  return models.map(
    model =>
      ({
        breadcrumbs: [
          { url: '/models', title: 'Models' },
          { url: getModelSlug(model), title: model.name },
        ],
        url: getModelUrl(model),
        title: model.name,
        body: model.description,
        tags: ['model'],
        id: uniqueHeadingId(getModelSlug(model), used),
        type: 'docs',
      }) satisfies Doc
  );
};
