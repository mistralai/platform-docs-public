import fs from "node:fs";
import path from "node:path";
import { defaultLocale, locales } from "./src/i18n/config";
import apiSidebarMetadata from "./src/content/en/api/sidebar-metadata.json" with { type: "json" };
import completeCookbook from "./public/complete-cookbook.json" with { type: "json" };

type CookbookEntry = {
  slug?: string;
};

const appLocaleRoot = path.join(process.cwd(), "src", "app", "[locale]");
const contentDocsRoot = path.join(process.cwd(), "src", "content", defaultLocale, "docs");
const modelFilesRoot = path.join(process.cwd(), "src", "schema", "models", "models");

export const targetLocales = locales.filter(locale => locale !== defaultLocale);

export function normalizeRoute(route: string): string {
  if (!route.startsWith("/")) route = `/${route}`;
  return route.length > 1 ? route.replace(/\/+$/, "") : route;
}

function encodeStaticRoute(route: string): string {
  const normalized = normalizeRoute(route);
  if (normalized === "/") return normalized;
  return `/${normalized
    .split("/")
    .filter(Boolean)
    .map(segment =>
      encodeURIComponent(segment).replace(/[!'()*]/g, char =>
        `%${char.charCodeAt(0).toString(16).toUpperCase()}`
      )
    )
    .join("/")}`;
}

function addRoute(routes: Set<string>, route: string): void {
  const normalized = encodeStaticRoute(route);
  if (normalized === `/${defaultLocale}`) return;
  if (locales.some(locale => normalized === `/${locale}` || normalized.startsWith(`/${locale}/`))) {
    return;
  }
  if (normalized.startsWith("/api/og")) return;
  routes.add(normalized);
}

function walkFiles(root: string, visit: (filePath: string) => void): void {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(root, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith("_")) continue;
      walkFiles(fullPath, visit);
      continue;
    }
    visit(fullPath);
  }
}

function routeFromAppPage(filePath: string): string | null {
  const relative = path.relative(appLocaleRoot, filePath);
  if (!relative.endsWith("page.tsx") && !relative.endsWith("page.mdx")) return null;

  const segments = relative.split(path.sep).slice(0, -1).filter(segment => {
    if (segment === "[locale]") return false;
    if (segment.startsWith("(") && segment.endsWith(")")) return false;
    return true;
  });

  if (segments.some(segment => segment.startsWith("[") && segment.endsWith("]"))) {
    return null;
  }

  return segments.length === 0 ? "/" : `/${segments.join("/")}`;
}

function collectAppRoutes(): string[] {
  const routes = new Set<string>();
  walkFiles(appLocaleRoot, filePath => {
    const route = routeFromAppPage(filePath);
    if (route) addRoute(routes, route);
  });
  return Array.from(routes);
}

function collectDocsContentRoutes(): string[] {
  const routes = new Set<string>();

  const walk = (dir: string, parts: string[]): void => {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    const hasPage = entries.some(entry => entry.isFile() && (entry.name === "page.mdx" || entry.name === "page.md"));
    if (hasPage && parts.length > 0) addRoute(routes, `/${parts.join("/")}`);

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (entry.name.startsWith("_")) continue;
      if (entry.name.startsWith("[") && entry.name.endsWith("]")) continue;
      walk(path.join(dir, entry.name), [...parts, entry.name]);
    }
  };

  walk(contentDocsRoot, []);
  return Array.from(routes);
}

function collectApiEndpointRoutes(): string[] {
  const endpointPrefix = "endpoint/";
  return apiSidebarMetadata
    .map(category => category.slug)
    .filter((slug): slug is string => typeof slug === "string" && slug.startsWith(endpointPrefix))
    .map(slug => `/api/endpoint/${slug.slice(endpointPrefix.length)}`);
}

function collectModelCardRoutes(): string[] {
  const routes = new Set<string>();
  walkFiles(modelFilesRoot, filePath => {
    if (!filePath.endsWith(".ts") || filePath.endsWith(`${path.sep}index.ts`)) return;
    const source = fs.readFileSync(filePath, "utf8");
    const match = source.match(/\bslug:\s*['"]([^'"]+)['"]/);
    if (match?.[1]) addRoute(routes, `/models/model-cards/${match[1]}`);
  });
  return Array.from(routes);
}

function collectCookbookRoutes(): string[] {
  return (completeCookbook as CookbookEntry[])
    .map(cookbook => cookbook.slug)
    .filter((slug): slug is string => typeof slug === "string" && slug.length > 0)
    .map(slug => `/resources/cookbooks/${slug}`);
}

export function collectDefaultLocaleRoutes(): string[] {
  const routes = new Set<string>();
  addRoute(routes, "/");
  for (const route of collectAppRoutes()) addRoute(routes, route);
  for (const route of collectDocsContentRoutes()) addRoute(routes, route);
  for (const route of collectApiEndpointRoutes()) addRoute(routes, route);
  for (const route of collectModelCardRoutes()) addRoute(routes, route);
  for (const route of collectCookbookRoutes()) addRoute(routes, route);
  return Array.from(routes).sort((a, b) => a.localeCompare(b));
}
