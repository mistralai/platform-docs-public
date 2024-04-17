// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const {themes} = require('prism-react-renderer');
const lightCodeTheme = themes.okaidia;
const darkCodeTheme = themes.okaidia;

const redocusaurus = [
  "redocusaurus",
  {
    // Plugin Options for loading OpenAPI files
    specs: [
      {
        spec: "openapi.yaml",
        route: "/api/",
      },
    ],
    // Theme Options for modifying how redoc renders them
    theme: {
      // Change with your site colors
      primaryColor: "#1890ff",
    },
  },
];

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Mistral AI Large Language Models",
  tagline: "Documentation for the deployment and usage of Mistral AI's LLMs",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://docs.mistral.ai",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",
  trailingSlash: true,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "mistralai", // Usually your GitHub org/user name.
  projectName: "platform-docs", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
    redocusaurus,
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/mistral-social-banner.jpg",
      docs: {
      sidebar: {
        autoCollapseCategories: false,
      },
    },
      navbar: {
        title: undefined,
        logo: {
          alt: "Mistral AI Logo",
          src: "img/logo.svg",
          srcDark: "img/logo-dark.svg",
          href: "https://mistral.ai/",
          target: "_self",
        },
        items: [
          {
            to: "https://chat.mistral.ai/",
            label: "Le Chat",
            position: "left",
          },
          {
            to: "https://console.mistral.ai/",
            label: "La Plateforme",
            position: "left",
          },
          {
            to: "/",
            label: "Docs",
            position: "left",
            activeBaseRegex: "^/(?!api)",
          },
          { to: "/api/", label: "API", position: "left" },
          {
            href: "https://github.com/mistralai/",
            label: "GitHub",
            position: "right",
          },
          {
            href: "https://discord.gg/mistralai",
            label: "Discord",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Documentation",
            items: [
              {
                label: "Documentation",
                to: "/",
              },
              {
                label: "Contributing",
                to: "guides/contribute",
              },
            ],
          },

          {
            title: "Community",
            items: [
              {
                label: "Discord",
                href: "https://discord.gg/mistralai",
              },
              {
                label: "X",
                href: "https://twitter.com/MistralAI",
              },
              {
                label: "GitHub",
                href: "https://github.com/mistralai",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Mistral AI.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['bash', 'diff', 'json'],
      },
      colorMode: {
        defaultMode: "light",
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
    }),
    plugins: [require.resolve('docusaurus-lunr-search')],
};

module.exports = config;
