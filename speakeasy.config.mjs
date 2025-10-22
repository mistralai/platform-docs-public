import { join, resolve } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import yaml from 'js-yaml';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

import { getSettings } from '@speakeasy-api/docs-md';
const OPENAPI_YAML = './openapi.yaml';
/**
 * @type {import("@speakeasy-api/docs-md").FrameworkConfig}
 */
const framework = {
  rendererType: 'mdx',
  componentPackageName: '@/app/(api)/components/speakeasy',
  elementIdSeparator: '_',

  buildPagePath(slug) {
    const settings = getSettings();
    return resolve(join(settings.output.pageOutDir, `${slug}/page.mdx`));
  },

  buildPagePreamble(frontmatter) {
    const yamlFrontmatter = `---
type: api
title: ${frontmatter.sidebarLabel || frontmatter.title || 'Api Reference'}
description: Bienvenue to Mistral AI's Api Reference
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

      const aIndex = parsedTags.findIndex(tag => tag.name === aTagName);
      const bIndex = parsedTags.findIndex(tag => tag.name === bTagName);

      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;

      return aIndex - bIndex;
    });

    writeFileSync(
      './src/app/(api)/components/sidebar-metadata.json',
      JSON.stringify(sortedMetadata, null, '  ')
    );
  },
};

/** @type {import("@speakeasy-api/docs-md").Settings} */
export default {
  spec: OPENAPI_YAML,
  output: {
    pageOutDir: './src/app/(api)/api',
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
      sdkTarballPath: './sdks/client-ts-1.10.0.tar.gz',
    },
    {
      language: 'python',
      sdkTarballPath: './sdks/client-python-1.9.11.tar.gz',
    },
    {
      language: 'curl',
    },
  ],
};
