/**
 * Merges V1 and V2 Python SDK code samples into the generated API reference pages.
 *
 * This script runs after `docs-md` has generated pages for both:
 *   - V2 Python (main output: src/content/en/api/)
 *   - V1 Python (temp output: src/app/(api)/api-v1-temp/)
 *
 * For each page that has a Python code sample, it wraps the V2 code inside a
 * <SDKVersionCodeSample> component. If the V1 SDK build has a matching sample,
 * the wrapper includes both V1 and V2; otherwise it shows a V2-only tab so the
 * SDK version remains explicit without inventing V1 support.
 */

import { readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import glob from 'fast-glob';

const V2_DIR = process.env.V2_DIR || './src/content/en/api';
const V1_TEMP_DIR = process.env.V1_TEMP_DIR || './src/app/(api)/api-v1-temp';
const V2_GLOB = process.env.V2_GLOB || './src/content/en/api/**/*.mdx';
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
    /import \{([\s\S]*?)\} from "(@\/app\/(?:\[locale\]\/)?\(api\)\/components\/speakeasy)";/;
  const match = importRe.exec(content);
  if (!match || match[1].includes(IMPORT_NAME)) return content;

  const updated = match[1].trimEnd() + `,\n  ${IMPORT_NAME}`;
  return content.replace(
    match[0],
    `import {${updated}\n} from "${match[2]}";`
  );
}

/**
 * Replaces a Python SectionContent block with a versioned V1/V2 wrapper.
 */
function replacePythonSection(
  content: string,
  id: string,
  v2Code: string,
  v1Code?: string
): string {
  // Escape the id for use in a regex
  const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const sectionRe = new RegExp(
    `<SectionContent\\s[^>]*id="${escapedId}"[^>]*>\\s*\\n\\s*<CodeSample>\\s*\\n\\s*\`\`\`python\\s*\\n([\\s\\S]*?)\`\`\`\\s*\\n\\s*<\\/CodeSample>\\s*\\n\\s*<\\/SectionContent>`
  );

  const v1Block = v1Code
    ? `<div data-version="v1">
<CodeSample>

\`\`\`python
${v1Code}\`\`\`

</CodeSample>
</div>`
    : '';

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
${v1Block}
</SDKVersionCodeSample>

</SectionContent>`;

  return content.replace(sectionRe, replacement);
}

async function main() {
  const hasV1TempDir = existsSync(V1_TEMP_DIR);
  const v2Pages = await glob(V2_GLOB);
  let mergedPageCount = 0;
  let v1v2SectionCount = 0;
  let v2OnlySectionCount = 0;
  let skippedCount = 0;

  for (const v2PagePath of v2Pages) {
    const relativePath = v2PagePath.replace(V2_DIR, '');
    const v1PagePath = join(V1_TEMP_DIR, relativePath);

    const v2Content = readFileSync(v2PagePath, 'utf-8');
    const v2CodeMap = extractPythonSections(v2Content);
    if (v2CodeMap.size === 0) {
      skippedCount++;
      continue;
    }

    const v1CodeMap = hasV1TempDir && existsSync(v1PagePath)
      ? extractPythonSections(readFileSync(v1PagePath, 'utf-8'))
      : new Map<string, string>();

    let merged = v2Content;
    let changed = false;
    for (const [id, v2Code] of v2CodeMap.entries()) {
      const v1Code = v1CodeMap.get(id);
      merged = replacePythonSection(merged, id, v2Code, v1Code);
      changed = true;
      if (v1Code) v1v2SectionCount++;
      else v2OnlySectionCount++;
    }

    if (!changed) {
      skippedCount++;
      continue;
    }

    merged = addImport(merged);
    writeFileSync(v2PagePath, merged);
    mergedPageCount++;
  }

  console.log(
    `✓ Wrapped ${mergedPageCount} pages with SDK version tabs (${v1v2SectionCount} V1/V2 samples, ${v2OnlySectionCount} V2-only samples, ${skippedCount} skipped)`
  );

  if (hasV1TempDir) {
    rmSync(V1_TEMP_DIR, { recursive: true, force: true });
    console.log('✓ Cleaned up temp directory');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
