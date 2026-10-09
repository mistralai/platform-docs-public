import { describe, expect, it } from "vitest";
import { remarkOgFromPath } from "@/lib/frontmatter/metadata-og";

// The plugin injects an ESM node whose estree holds the OG values as string
// literals; collecting them is enough to check what ends up in the URL.
function ogLiterals(filePath: string): string[] {
  const transform = (remarkOgFromPath as any)() as (
    tree: any,
    file: any
  ) => void;
  const tree = { type: "root", children: [] as any[] };
  transform(tree, { path: filePath });
  const literals: string[] = [];
  const walk = (node: any): void => {
    if (!node || typeof node !== "object") return;
    if (node.type === "Literal" && typeof node.value === "string") {
      literals.push(node.value);
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(walk);
      else if (value && typeof value === "object") walk(value);
    }
  };
  walk(tree.children[0].data.estree);
  return literals;
}

describe("remarkOgFromPath eyebrow", () => {
  it("replaces every underscore of the slug, not only the first", () => {
    const literals = ogLiterals(
      "/repo/src/content/en/docs/studio/audio/speech_to_text/realtime_transcription/client_auth/page.mdx"
    );
    expect(literals).toContain(
      "studio > audio > speech to text > realtime transcription > client auth"
    );
    const eyebrows = literals.filter(value => value.startsWith("studio > "));
    expect(eyebrows.length).toBeGreaterThan(0);
    expect(eyebrows.some(value => value.includes("_"))).toBe(false);
  });

  it("builds the eyebrow from the path for non-default locales", () => {
    expect(
      ogLiterals("/repo/src/content/fr/docs/admin/page.mdx")
    ).toContain("admin");
  });
});
