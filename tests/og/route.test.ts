import { readFile } from "node:fs/promises";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

const PUBLIC_DIR = path.join(process.cwd(), "public");

// Serve fonts and OG tiles from public/ instead of the network; anything else
// under the site origin is a 404, like a missing asset in production.
beforeAll(() => {
  vi.stubEnv("NEXT_PUBLIC_BASE_URL", "http://og.test");
  vi.stubGlobal("fetch", async (input: RequestInfo | URL) => {
    const url = new URL(typeof input === "string" ? input : input.toString());
    if (url.origin !== "http://og.test") {
      return new Response("offline", { status: 503 });
    }
    try {
      const data = await readFile(path.join(PUBLIC_DIR, url.pathname));
      return new Response(data, { status: 200 });
    } catch {
      return new Response("<html>Not found</html>", {
        status: 404,
        headers: { "content-type": "text/html" },
      });
    }
  });
});

afterAll(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

async function get(query: string) {
  const { GET } = await import("@/app/api/og/route");
  const response = await GET(
    new Request(`http://og.test/api/og${query}`) as any
  );
  const body = Buffer.from(await response.arrayBuffer());
  return { response, body };
}

describe("/api/og", () => {
  it("renders a cacheable PNG", async () => {
    const { response, body } = await get(
      "?type=generic&title=Hello&description=World&eyebraw=docs"
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
    expect(response.headers.get("cache-control")).toContain("immutable");
    expect(body.readUInt32BE(0)).toBe(0x89504e47);
    expect(body.readUInt32BE(16)).toBe(1200);
    expect(body.readUInt32BE(20)).toBe(630);
  });

  it("returns an uncached 500 instead of an empty PNG when rendering fails", async () => {
    const { response, body } = await get(
      "?type=generic&title=Missing&description=x&image=%2Fogs%2Fdoes-not-exist.png"
    );
    expect(response.status).toBe(500);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(body.length).toBeGreaterThan(0);
  });
});
