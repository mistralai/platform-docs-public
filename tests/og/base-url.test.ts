import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("BASE_URL", () => {
  it("drops a trailing slash from NEXT_PUBLIC_BASE_URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_URL", "https://docs.mistral.ai/");
    const { BASE_URL } = await import("@/lib/constants");
    expect(BASE_URL).toBe("https://docs.mistral.ai");
  });

  it("builds OG image URLs without a double slash", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_URL", "https://docs.mistral.ai/");
    const { getOGImageUrl } = await import("@/components/og/helpers");
    const url = getOGImageUrl({
      path: "generic",
      eyebraw: "Docs",
      title: "Documentation",
      description: "Description",
      image: "/ogs/docs.png",
    });
    expect(url.startsWith("https://docs.mistral.ai/api/og?")).toBe(true);
  });
});
