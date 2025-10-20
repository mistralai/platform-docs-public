import { Cookbook, CookbookSaved } from '.';
import completeCookbook from '@/../public/complete-cookbook.json';
import {
  FEATURED_COOKBOOK_PATHS,
  FEATURED_USE_CASES,
  FEATURED_INTEGRATIONS,
} from './data';

// ------------------------------------------------------------
// Data processing
// ------------------------------------------------------------
export const allCookbooks =
  completeCookbook as unknown as Cookbook[];

export const fullCookbooks: CookbookSaved[] = allCookbooks;

export const featuredCookbooks = fullCookbooks.filter(
  cookbook => cookbook.featured
);
export const latestCookbooks = fullCookbooks.filter(
  cookbook => cookbook.latest
);

// Get all unique use cases and integrations for topics
export const allUseCases = Array.from(
  new Set(fullCookbooks.flatMap(cookbook => cookbook.useCases))
).sort();

export const allIntegrations = Array.from(
  new Set(fullCookbooks.flatMap(cookbook => cookbook.integrations))
).sort();

// Curated featured cookbooks from our selection
export const curatedFeaturedCookbooks = FEATURED_COOKBOOK_PATHS.map(path => {
  const cookbook = fullCookbooks.find(cookbook => cookbook.path === path);
  if (!cookbook) {
    console.warn(`[WARNING] Cookbook not found for path: ${path}`);
    return undefined;
  }
  return cookbook;
}).filter(Boolean) as Cookbook[];

// Featured topics for the topics section - preserving manual order
export const featuredUseCases = FEATURED_USE_CASES.filter(useCase =>
  allUseCases.includes(useCase)
);

// Featured integrations for the topics section - preserving manual order
export const featuredIntegrations = FEATURED_INTEGRATIONS.filter(integration =>
  allIntegrations.includes(integration)
);

// Export types
export type CookbookKey = (typeof fullCookbooks)[number]['slug'];
