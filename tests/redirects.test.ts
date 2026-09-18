import { describe, expect, it, vi } from "vitest";

// The real route-utils module loads generated, gitignored artifacts
// (e.g. public/complete-cookbook.json) at import time. redirect.ts only needs
// targetLocales, so mock it with the same value the real module derives from
// the i18n config.
vi.mock("../route-utils", async () => {
  const { locales, defaultLocale } = await import("../src/i18n/config");
  return { targetLocales: locales.filter(locale => locale !== defaultLocale) };
});

const { redirects } = await import("../redirect");

type Rule = { source: string; destination: string; permanent: boolean };

function compileSource(source: string): { regex: RegExp; params: string[] } {
  const params: string[] = [];
  const pattern = source
    .split("/")
    .map(segment => {
      const localeSegment = segment.match(/^:([a-zA-Z]+)\((.+)\)$/);
      if (localeSegment) {
        params.push(localeSegment[1]);
        return `(${localeSegment[2]})`;
      }
      const wildcard = segment.match(/^:([a-zA-Z]+)\*$/);
      if (wildcard) {
        params.push(wildcard[1]);
        return "(.*)";
      }
      const single = segment.match(/^:([a-zA-Z]+)$/);
      if (single) {
        params.push(single[1]);
        return "([^/]+)";
      }
      return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    })
    .join("/");
  return { regex: new RegExp(`^${pattern}$`), params };
}

function applyRule(rule: Rule, url: string): string | null {
  if (/^https?:\/\//.test(rule.destination)) {
    return compileSource(rule.source).regex.test(url) ? rule.destination : null;
  }
  const { regex, params } = compileSource(rule.source);
  const match = url.match(regex);
  if (!match) return null;
  let destination = rule.destination;
  for (const [index, name] of params.entries()) {
    destination = destination.replace(new RegExp(`:${name}(\\([^)]*\\))?\\*?`, "g"), match[index + 1] ?? "");
  }
  return destination;
}

// Simulate a browser following the redirect chain hop by hop.
function resolveRedirect(url: string, maxHops = 5): string {
  let current = url;
  for (let hop = 0; hop < maxHops; hop++) {
    const rule = redirects.find(r => applyRule(r, current) !== null);
    if (!rule) break;
    const next = applyRule(rule, current);
    if (!next || next === current || /^https?:\/\//.test(next)) {
      current = next ?? current;
      break;
    }
    current = next;
  }
  return current;
}

describe("legacy /en/ redirects", () => {
  it("redirects the reported legacy /en/studio-api URL to the current studio page", () => {
    expect(resolveRedirect("/en/studio-api/audio/overview")).toBe("/studio/audio/overview");
  });

  it("strips the /en prefix from already-valid current pages", () => {
    expect(resolveRedirect("/en/studio/audio/overview")).toBe("/studio/audio/overview");
    expect(resolveRedirect("/en/getting-started/platform-overview")).toBe(
      "/getting-started/platform-overview"
    );
  });

  it("redirects the bare /en prefix to the home page", () => {
    expect(resolveRedirect("/en")).toBe("/");
  });

  it("exposes the /en strip rules as permanent redirects", () => {
    const stripRules = redirects.filter(rule => rule.source === "/en" || rule.source === "/en/:path*");
    expect(stripRules).toEqual([
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ]);
  });

  it("never locale-prefixes the /en strip rules", () => {
    const localePrefixedEnRules = redirects.filter(
      rule => rule.source !== "/en" && rule.source !== "/en/:path*" && /\/en(\/|$)/.test(rule.source)
    );
    expect(localePrefixedEnRules).toEqual([]);
  });
});

describe("existing redirect rules keep working", () => {
  it("resolves the studio-api catch-all", () => {
    expect(resolveRedirect("/studio-api/audio/overview")).toBe("/studio/audio/overview");
  });

  it("resolves capabilities rules", () => {
    expect(resolveRedirect("/capabilities/audio")).toBe("/studio/audio/overview");
    expect(resolveRedirect("/capabilities/audio/speech_to_text")).toBe(
      "/studio/audio/speech_to_text"
    );
  });

  it("resolves locale-prefixed rules", () => {
    expect(resolveRedirect("/fr/studio-api/audio/overview")).toBe("/fr/studio/audio/overview");
    expect(resolveRedirect("/fr/capabilities/audio")).toBe("/fr/studio/audio/overview");
  });
});
