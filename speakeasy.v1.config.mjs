import { join, resolve } from 'node:path';
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
    return `---
type: api
title: ${frontmatter.sidebarLabel || frontmatter.title || 'Api Reference'}
---`;
  },
};

/** @type {import("@speakeasy-api/docs-md").Settings} */
export default {
  spec: OPENAPI_YAML,
  output: {
    pageOutDir: './src/app/(api)/api-v1-temp',
    framework,
    aboutPage: false,
    generateRequestBodyExamples: false,
    generateResponseExamples: false,
  },
  display: {
    visibleResponses: 'success',
    expandTopLevelPropertiesOnPageLoad: false,
  },
  codeSamples: [
    {
      language: 'python',
      sdkTarballPath: './sdks/client-python-1.9.11.tar.gz',
    },
  ],
};
