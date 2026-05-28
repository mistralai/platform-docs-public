import { uniqueHeadingId } from '@/lib/heading-utils';
import { getModelSlug, getModelUrl, models } from '@/schema';
import { Doc } from '@/schema/doc';
import { createLingo } from '@lingo.dev/react';
import { loadMessages } from '@/i18n/messages';

export const getIndex = (locale: string) => {
  const l = createLingo(locale, loadMessages(locale));
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
        body: model.describe(l).description,
        tags: ['model'],
        id: uniqueHeadingId(getModelSlug(model), used),
        type: 'docs',
      }) satisfies Doc
  );
};
