import { MODELS } from './models';
import { Names, ModelTemplate, Slugs } from './schema';

export const modelNames = MODELS.map(m => m.name);
export type ModelKey = Names<typeof MODELS>;
export type ModelSlug = Slugs<typeof MODELS>;
export type Model = ModelTemplate<ModelKey, ModelSlug>;

export function findModelBySlug(slug: string): Model | undefined {
  return (models as readonly Model[]).find(m => m.slug === slug);
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

export const isLegacyModel = (model: Model) =>
  model.status === 'Deprecated' || model.status === 'Retired';

export const models = [...MODELS] as Model[];

export const nonLegacyModels = models.filter(
  model => model.status !== 'Deprecated' && model.status !== 'Retired'
);

export * from './schema';
export * from './models';
export * from './endpoints';
