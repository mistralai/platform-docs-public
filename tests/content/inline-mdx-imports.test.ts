import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  removeAllImports,
  removeMdxModuleLines,
  resolveAndInlineMdxImports,
} from "@/lib/content/inline-mdx-imports";

let root: string;

async function write(relativePath: string, content: string): Promise<void> {
  const full = path.join(root, relativePath);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, content, "utf8");
}

beforeAll(async () => {
  root = await mkdtemp(path.join(os.tmpdir(), "inline-mdx-imports-"));
  await write(
    "tab/_page.mdx",
    [
      "import Nested from './nested/_page.mdx';",
      "",
      "```python",
      "print('tab')",
      "```",
      "",
      "<Nested />",
    ].join("\n")
  );
  await write("tab/nested/_page.mdx", "Nested content");
  await write(
    "dollars/_page.mdx",
    "Price: $15.00, capture $1, literal $$ and $& kept"
  );
  await write("cycle-a/_page.mdx", "import B from '../cycle-b/_page.mdx';\n\nA\n\n<B />");
  await write("cycle-b/_page.mdx", "import A from '../cycle-a/_page.mdx';\n\nB\n\n<A />");
});

afterAll(async () => {
  await rm(root, { recursive: true, force: true });
});

describe("resolveAndInlineMdxImports", () => {
  it("inlines self-closing partials recursively and drops their imports", async () => {
    const page = "import Tab from './tab/_page.mdx';\n\n# Title\n\n<Tab/>";
    const out = await resolveAndInlineMdxImports(page, root);
    expect(out).toContain("print('tab')");
    expect(out).toContain("Nested content");
    expect(out).not.toContain("<Tab");
    expect(out).not.toContain("<Nested");
    expect(out).not.toMatch(/^import /m);
  });

  it("inlines open/close partials", async () => {
    const page = "import Tab from './tab/_page.mdx';\n\n<Tab></Tab>";
    const out = await resolveAndInlineMdxImports(page, root);
    expect(out).toContain("print('tab')");
    expect(out).not.toContain("</Tab>");
  });

  it("keeps `$` sequences from partials verbatim", async () => {
    const page = "import D from './dollars/_page.mdx';\n\n<D />";
    const out = await resolveAndInlineMdxImports(page, root);
    expect(out).toContain("Price: $15.00, capture $1, literal $$ and $& kept");
  });

  it("drops imports of missing partials without throwing", async () => {
    const page = "import Missing from './missing/_page.mdx';\n\nBody";
    const out = await resolveAndInlineMdxImports(page, root);
    expect(out).not.toMatch(/^import /m);
    expect(out).toContain("Body");
  });

  it("stops on import cycles", async () => {
    const page = "import A from './cycle-a/_page.mdx';\n\n<A />";
    const out = await resolveAndInlineMdxImports(page, root);
    expect(out).toContain("A");
    expect(out).toContain("B");
  });
});

const PAGE_WITH_CODE_IMPORTS = [
  "import { Tabs } from '@/components/common/multi-codeblock';",
  "export const meta = {};",
  "",
  "```python",
  "import os",
  "from mistralai.client import Mistral",
  "```",
  "",
  "~~~typescript",
  "import { z } from 'zod';",
  "export const Book = z.object({});",
  "~~~",
].join("\n");

describe("removeAllImports", () => {
  it("drops MDX imports and keeps the imports of code samples", () => {
    const out = removeAllImports(PAGE_WITH_CODE_IMPORTS);
    expect(out).not.toContain("@/components/common/multi-codeblock");
    expect(out).toContain("import { z } from 'zod';");
  });
});

describe("removeMdxModuleLines", () => {
  it("drops MDX imports and exports and keeps every line of code samples", () => {
    const out = removeMdxModuleLines(PAGE_WITH_CODE_IMPORTS);
    expect(out).not.toContain("@/components/common/multi-codeblock");
    expect(out).not.toContain("export const meta");
    expect(out).toContain("import os");
    expect(out).toContain("import { z } from 'zod';");
    expect(out).toContain("export const Book = z.object({});");
  });

  it("keeps a longer fence open past a shorter one inside it", () => {
    const page = ["````md", "```", "import os", "````", "import Late from 'x';"].join("\n");
    const out = removeMdxModuleLines(page);
    expect(out).toContain("import os");
    expect(out).not.toContain("import Late");
  });
});
