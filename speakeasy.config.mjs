import { join, resolve } from 'node:path';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import yaml from 'js-yaml';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

import { getSettings } from '@speakeasy-api/docs-md';
const OPENAPI_YAML = process.env.SPEAKEASY_OPENAPI_YAML || './openapi.yaml';
// Output is locale-driven so the same config generates EN (default) or a
// translated locale (see src/scripts/api/build-fr.ts). Defaults = EN, so the
// EN build is unchanged.
const PAGE_OUT_DIR = process.env.API_PAGE_OUT_DIR || './src/content/en/api';
const SIDEBAR_META_PATH =
  process.env.API_SIDEBAR_META_PATH || './src/content/en/api/sidebar-metadata.json';

function existingHiddenLine(frontmatter) {
  const slug = frontmatter?.slug || frontmatter?.sidebarLabel;
  if (!slug) return '';

  const pagePath = resolve(join(PAGE_OUT_DIR, `${slug}/page.mdx`));
  if (!existsSync(pagePath)) return '';

  const frontmatterMatch = readFileSync(pagePath, 'utf8').match(
    /^---\n([\s\S]*?)\n---/
  );
  if (!frontmatterMatch) return '';

  const hiddenMatch = frontmatterMatch[1].match(/^hidden:\s*(true|false)\s*$/m);
  return hiddenMatch ? hiddenMatch[0] : '';
}
/**
 * @type {import("@speakeasy-api/docs-md").FrameworkConfig}
 */
const framework = {
  rendererType: 'mdx',
  componentPackageName: '@/app/[locale]/(api)/components/speakeasy',
  elementIdSeparator: '_',

  buildPagePath(slug) {
    const settings = getSettings();
    return resolve(join(settings.output.pageOutDir, `${slug}/page.mdx`));
  },

  buildPagePreamble(frontmatter) {
    const hiddenLine = existingHiddenLine(frontmatter);
    const yamlFrontmatter = `---
type: api
title: ${frontmatter.sidebarLabel || frontmatter.title || 'Api Reference'}
description: Welcome to Mistral AI's Api Reference${hiddenLine ? `\n${hiddenLine}` : ''}
---`;
    return yamlFrontmatter;
  },

  postProcess(metadata) {
    // Note: the format for this data is very much a quick and dirty
    // implementation. It's shape will almost certainly change and become easier
    // to work with in the future.

    const yamlContent = readFileSync(OPENAPI_YAML, 'utf8');
    const parsedYaml = yaml.load(yamlContent);

    const parsedTags =
      parsedYaml?.tags?.map(tag => ({
        name: tag.name,
        displayName: tag['x-displayName'] || tag.name,
        description: tag.description || '',
      })) || [];

    const sortedMetadata = metadata.sort((a, b) => {
      if (a.tags.length === 0) return -1;
      if (b.tags.length === 0) return 1;

      const aTagName = a.tags[0]?.name;
      const bTagName = b.tags[0]?.name;

      const normalize = name => name?.replace(/\//g, '.');
      const aIndex = parsedTags.findIndex(tag => tag.name === normalize(aTagName));
      const bIndex = parsedTags.findIndex(tag => tag.name === normalize(bTagName));

      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;

      return aIndex - bIndex;
    });

    writeFileSync(
      SIDEBAR_META_PATH,
      JSON.stringify(sortedMetadata, null, '  ')
    );
  },
};

/** @type {import("@speakeasy-api/docs-md").Settings} */
export default {
  spec: OPENAPI_YAML,
  output: {
    pageOutDir: PAGE_OUT_DIR,
    framework,
    aboutPage: false,
    generateRequestBodyExamples: true,
    generateResponseExamples: true,
  },
  display: {
    visibleResponses: 'success',
    expandTopLevelPropertiesOnPageLoad: false,
  },
  codeSamples: [
    {
      language: 'typescript',
      sdkTarballPath: './sdks/client-ts-2.4.1.tar.gz',
    },
    {
      language: 'python',
      sdkTarballPath: './sdks/client-python-2.5.2.tar.gz',
    },
    {
      language: 'curl',
    },
  ],
};
