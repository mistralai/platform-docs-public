import { defaultLocale } from "./src/i18n/config";
import { collectDefaultLocaleRoutes, targetLocales } from "./route-utils";

type RewriteRule = {
  source: string;
  destination: string;
};

const rawRewrites: RewriteRule[] = [
  {
    source: "/api",
    destination: "/api/endpoint/chat",
  },
];

const defaultLocaleRouteRewrites = collectDefaultLocaleRoutes()
  .filter(route => !rawRewrites.some(rule => rule.source === route))
  .map(route => ({
    source: route,
    destination: route === "/" ? `/${defaultLocale}` : `/${defaultLocale}${route}`,
  }));

const defaultLocaleRawRewrites = rawRewrites.map(rule => ({
  ...rule,
  destination: `/${defaultLocale}${rule.destination}`,
}));

const targetLocaleRawRewrites = targetLocales.flatMap(locale =>
  rawRewrites.map(rule => ({
    source: `/${locale}${rule.source}`,
    destination: `/${locale}${rule.destination}`,
  }))
);

export const rewrites = [
  ...defaultLocaleRawRewrites,
  ...targetLocaleRawRewrites,
  ...defaultLocaleRouteRewrites,
];
