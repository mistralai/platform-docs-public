/**
 * Merges V1 and V2 Python SDK code samples into the generated API reference pages.
 *
 * This script runs after `docs-md` has generated pages for both:
 *   - V2 Python (main output: src/app/(api)/api/)
 *   - V1 Python (temp output: src/app/(api)/api-v1-temp/)
 *
 * For each page that has a Python code sample, it wraps the V2 code alongside
 * the V1 code inside a <SDKVersionCodeSample> component so users can toggle
 * between SDK versions.
 */

import { readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import glob from 'fast-glob';

const V2_DIR = './src/app/(api)/api';
const V1_TEMP_DIR = './src/app/(api)/api-v1-temp';
// Escaped versions for glob patterns (parentheses are special in glob)
const V2_GLOB = './src/app/\\(api\\)/api/**/*.mdx';
const IMPORT_NAME = 'SDKVersionCodeSample';

/**
 * Extracts all Python code samples from an MDX page.
 * Returns a map of section ID → python code string.
 */
function extractPythonSections(content: string): Map<string, string> {
  const results = new Map<string, string>();

  // Match: <SectionContent slot="content" id="..._code-samples_python" >
  //          <CodeSample>
  //            ```python
  //            ...code...
  //            ```
  //          </CodeSample>
  //        </SectionContent>
  const sectionRe =
    /<SectionContent\s[^>]*id="([^"]+_code-samples_python)"[^>]*>\s*\n\s*<CodeSample>\s*\n\s*```python\s*\n([\s\S]*?)```\s*\n\s*<\/CodeSample>\s*\n\s*<\/SectionContent>/g;

  let match: RegExpExecArray | null;
  while ((match = sectionRe.exec(content)) !== null) {
    results.set(match[1], match[2]);
  }
  return results;
}

/**
 * Adds SDKVersionCodeSample to the speakeasy import block if not already present.
 */
function addImport(content: string): string {
  const importRe =
    /import \{([\s\S]*?)\} from "@\/app\/\(api\)\/components\/speakeasy";/;
  const match = importRe.exec(content);
  if (!match || match[1].includes(IMPORT_NAME)) return content;

  const updated = match[1].trimEnd() + `,\n  ${IMPORT_NAME}`;
  return content.replace(
    match[0],
    `import {${updated}\n} from "@/app/(api)/components/speakeasy";`
  );
}

/**
 * Replaces a Python SectionContent block with a versioned V1/V2 wrapper.
 */
function replacePythonSection(
  content: string,
  id: string,
  v1Code: string,
  v2Code: string
): string {
  // Escape the id for use in a regex
  const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const sectionRe = new RegExp(
    `<SectionContent\\s[^>]*id="${escapedId}"[^>]*>\\s*\\n\\s*<CodeSample>\\s*\\n\\s*\`\`\`python\\s*\\n([\\s\\S]*?)\`\`\`\\s*\\n\\s*<\\/CodeSample>\\s*\\n\\s*<\\/SectionContent>`
  );

  const replacement = `<SectionContent
  slot="content"
  id="${id}"
>

<SDKVersionCodeSample>
<div data-version="v2">
<CodeSample>

\`\`\`python
${v2Code}\`\`\`

</CodeSample>
</div>
<div data-version="v1">
<CodeSample>

\`\`\`python
${v1Code}\`\`\`

</CodeSample>
</div>
</SDKVersionCodeSample>

</SectionContent>`;

  return content.replace(sectionRe, replacement);
}

async function main() {
  if (!existsSync(V1_TEMP_DIR)) {
    console.error(
      `V1 temp directory not found: ${V1_TEMP_DIR}\nRun: pnpm docs-md -c speakeasy.v1.config.mjs first.`
    );
    process.exit(1);
  }

  const v2Pages = await glob(V2_GLOB);
  let mergedCount = 0;
  let skippedCount = 0;

  for (const v2PagePath of v2Pages) {
    const relativePath = v2PagePath.replace(V2_DIR, '');
    const v1PagePath = join(V1_TEMP_DIR, relativePath);

    if (!existsSync(v1PagePath)) {
      skippedCount++;
      continue;
    }

    const v2Content = readFileSync(v2PagePath, 'utf-8');
    const v1Content = readFileSync(v1PagePath, 'utf-8');

    const v1CodeMap = extractPythonSections(v1Content);
    if (v1CodeMap.size === 0) {
      skippedCount++;
      continue;
    }

    // Also extract V2 sections to get their current code
    const v2CodeMap = extractPythonSections(v2Content);

    let merged = v2Content;
    for (const [id, v1Code] of v1CodeMap.entries()) {
      const v2Code = v2CodeMap.get(id);
      if (!v2Code) continue;
      merged = replacePythonSection(merged, id, v1Code, v2Code);
    }

    merged = addImport(merged);
    writeFileSync(v2PagePath, merged);
    mergedCount++;
  }

  console.log(
    `✓ Merged ${mergedCount} pages with V1/V2 Python tabs (${skippedCount} skipped)`
  );

  rmSync(V1_TEMP_DIR, { recursive: true, force: true });
  console.log('✓ Cleaned up temp directory');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
