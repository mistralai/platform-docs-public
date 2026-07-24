/**
 * Post-process generated docs-md pages for content that Speakeasy drops.
 *
 * Current fixes:
 *   - `format: binary` schemas referenced as File are expanded by docs-md into
 *     a synthetic object with `content` and `fileName` fields. During that
 *     expansion, the original `File.description` is not rendered at the root
 *     property level. Re-inject it on each generated `file` property.
 *   - docs-md escapes braces in all MDX text, including inline code spans. That
 *     turns examples like `{ "type": "text" }` into `\{ "type": "text" \}`.
 *     Undo that only inside inline code spans.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import glob from 'fast-glob';

const PAGE_GLOB =
  process.env.API_MDX_POSTPROCESS_GLOB || './src/content/en/api/**/*.mdx';
const SPEAKEASY_IMPORT_PATH =
  process.env.API_MDX_SPEAKEASY_IMPORT ||
  '@/app/[locale]/(api)/components/speakeasy';

const FILE_DESCRIPTION = `<ExpandablePropertyDescription slot="description">

The File object (not file name) to be uploaded. To upload a file and specify a custom file name you should format your request as such:

\`\`\`bash
file=@path/to/your/file.jsonl;filename=custom_name.jsonl
\`\`\`

Otherwise, you can just keep the original file name:

\`\`\`bash
file=@path/to/your/file.jsonl
\`\`\`

</ExpandablePropertyDescription>`;

const FILE_BREAKOUT_DESCRIPTION = `<ExpandableBreakoutDescription slot="description">

The File object (not file name) to be uploaded. To upload a file and specify a custom file name you should format your request as such:

\`\`\`bash
file=@path/to/your/file.jsonl;filename=custom_name.jsonl
\`\`\`

Otherwise, you can just keep the original file name:

\`\`\`bash
file=@path/to/your/file.jsonl
\`\`\`

</ExpandableBreakoutDescription>`;

// Build an import-statement regex anchored on the configured component path.
const importRegex = new RegExp(
  `import \\{([\\s\\S]*?)\\} from "${SPEAKEASY_IMPORT_PATH.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  )}";`
);

function ensureBreakoutDescriptionImport(content: string): string {
  if (!content.includes('<ExpandableBreakoutDescription')) return content;
  if (content.includes('  ExpandableBreakoutDescription,')) return content;

  return content.replace(importRegex, (match, imports) => {
    if (!imports.includes('ExpandableBreakoutTitle,')) return match;
    return `import {${imports.replace(
      '  ExpandableBreakoutTitle,',
      '  ExpandableBreakoutTitle,\n  ExpandableBreakoutDescription,'
    )}} from "${SPEAKEASY_IMPORT_PATH}";`;
  });
}

function ensureResponsesSectionTitleImport(content: string): string {
  if (!content.includes('<OperationResponsesSectionTitle')) return content;
  if (content.includes('  OperationResponsesSectionTitle,')) return content;

  return content.replace(importRegex, (match, imports) => {
    if (!imports.includes('OperationResponseBodySection,')) return match;
    return `import {${imports.replace(
      '  OperationResponseBodySection,',
      '  OperationResponseBodySection,\n  OperationResponsesSectionTitle,'
    )}} from "${SPEAKEASY_IMPORT_PATH}";`;
  });
}

function isolateResponseTabbedSectionTitles(content: string): { content: string; count: number } {
  let count = 0;
  const updated = content.replace(
    /(<OperationResponseBodySection slot="response-body">[\s\S]*?<ResponseTabbedSection>[\s\S]*?)<SectionTitle slot="title">([\s\S]*?)<\/SectionTitle>/g,
    (_match, before, titleBody) => {
      count += 1;
      return `${before}<OperationResponsesSectionTitle slot="responses-title">${titleBody}</OperationResponsesSectionTitle>`;
    }
  );
  return { content: ensureResponsesSectionTitleImport(updated), count };
}

function injectFileDescription(content: string): { content: string; count: number } {
  let count = 0;

  const propertyRe = /(<ExpandableProperty\n[\s\S]*?\n  id="file"\n[\s\S]*?typeInfo=\{\{"label":"File"[\s\S]*?>\n\n<ExpandablePropertyTitle slot="title">\n\n##### file[\s\S]*?<\/ExpandablePropertyTitle>\n\n)(?!<ExpandablePropertyDescription slot="description">)/g;

  let updated = content.replace(propertyRe, match => {
    count += 1;
    return `${match}${FILE_DESCRIPTION}\n\n`;
  });

  // The generated nested breakout is visually rendered as "File {object}" in
  // the dropdown. Put the same description there too; otherwise the root
  // property has the text, but the visible dropdown body looks empty.
  const breakoutRe = /(<ExpandableBreakout\n[\s\S]*?\n  id="file_File"\n[\s\S]*?>\n\n<ExpandableBreakoutTitle slot="title">\n\n#### File[\s\S]*?<\/ExpandableBreakoutTitle>\n\n)(?!<ExpandableBreakoutDescription slot="description">)/g;

  updated = updated.replace(breakoutRe, match => {
    count += 1;
    return `${match}${FILE_BREAKOUT_DESCRIPTION}\n\n`;
  });

  updated = ensureBreakoutDescriptionImport(updated);

  return { content: updated, count };
}

function unescapeInlineCodeBraces(content: string): { content: string; count: number } {
  let count = 0;
  const updated = content.replace(/`([^`\n]*)`/g, (match, inlineCode) => {
    const unescaped = inlineCode.replace(/\\([{}])/g, (_braceMatch: string, brace: string) => {
      count += 1;
      return brace;
    });
    return unescaped === inlineCode ? match : `\`${unescaped}\``;
  });
  return { content: updated, count };
}

async function main() {
  const files = await glob(PAGE_GLOB);
  let total = 0;
  let inlineCodeBraceTotal = 0;
  let changed = 0;

  for (const file of files) {
    const original = readFileSync(file, 'utf8');
    // NOTE: isolateResponseTabbedSectionTitles is intentionally disabled. It
    // rewrote <SectionTitle slot="title"> -> <OperationResponsesSectionTitle
    // slot="responses-title">, which (a) is ignored by ResponseTabbedSection
    // (it only reads slot "tab"/"content") and (b) stripped the required title
    // child from the wrapping <Section>, crashing at runtime with
    // "Section must have exactly one title child, not 0".
    const fileResult = injectFileDescription(original);
    const inlineCodeResult = unescapeInlineCodeBraces(fileResult.content);
    if (inlineCodeResult.content !== original) {
      writeFileSync(file, inlineCodeResult.content);
      changed += 1;
      total += fileResult.count;
      inlineCodeBraceTotal += inlineCodeResult.count;
    }
  }

  console.log(
    `Post-processed MDX: injected ${total} file description(s), unescaped ${inlineCodeBraceTotal} inline-code brace(s) across ${changed} file(s)`
  );
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
