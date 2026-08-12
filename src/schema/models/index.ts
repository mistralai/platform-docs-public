import { MODELS } from './models';
import { Names, ModelTemplate, Slugs, getModelSlugAliases } from './schema';

export const modelNames = MODELS.map(m => m.name);
export type ModelKey = Names<typeof MODELS>;
export type ModelSlug = Slugs<typeof MODELS>;
export type Model = ModelTemplate<ModelKey, ModelSlug>;

export function findModelBySlug(slug: string): Model | undefined {
  return (models as readonly Model[]).find(m => m.slug === slug);
}

export function getResolvableModelSlugAliases(model: Model): string[] {
  const aliasCounts = new Map<string, number>();

  for (const candidate of models as readonly Model[]) {
    for (const alias of getModelSlugAliases(candidate)) {
      aliasCounts.set(alias, (aliasCounts.get(alias) ?? 0) + 1);
    }
  }

  return getModelSlugAliases(model).filter(alias => aliasCounts.get(alias) === 1);
}

export function findModelBySlugAlias(slug: string): Model | undefined {
  return (models as readonly Model[]).find(m => getResolvableModelSlugAliases(m).includes(slug));
}

export function findModelBySlugOrAlias(slug: string): Model | undefined {
  return findModelBySlug(slug) ?? findModelBySlugAlias(slug);
}

export function isModelSlugAlias(slug: string): boolean {
  return Boolean(findModelBySlugAlias(slug));
}

export function getModelSlug(model: Model) {
  return (
    model.slug ??
    model.name.toLowerCase().replace(/ /g, '-').replace(/\./g, '-')
  );
}

export function getModelUrl(model: Model) {
  return `/models/${getModelSlug(model)}`;
}

export function getModelLicenses(model: Model): string[] {
  return Array.from(
    new Set(
      (model.weights ?? [])
        .map(w => w.license)
        .filter((license): license is string => !!license)
    )
  );
}

export const isLegacyModel = (model: Model) =>
  model.status === 'Deprecated' || model.status === 'Retired';

export const models = [...MODELS] as Model[];

export const nonLegacyModels = models.filter(
  model => model.status !== 'Deprecated' && model.status !== 'Retired'
);

export * from './schema';
export * from './models';
export * from './endpoints';
export * from './i18n';
export * from './pricing-currency';
