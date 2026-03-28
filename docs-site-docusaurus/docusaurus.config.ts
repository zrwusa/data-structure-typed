import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'data-structure-typed',
  tagline: 'JavaScript/TypeScript Data Structure Library — STL-like, zero-dependency',
  favicon: 'img/favicon.ico',
  url: 'https://data-structure-typed-docs.vercel.app',
  baseUrl: '/',
  organizationName: 'zrwusa',
  projectName: 'data-structure-typed',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  markdown: {
    format: 'md',
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/zrwusa/data-structure-typed/edit/main/docs-site-docusaurus/',
          remarkPlugins: [],
          rehypePlugins: [],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'data-structure-typed',
      items: [
        {type: 'docSidebar', sidebarId: 'guideSidebar', position: 'left', label: 'Guide'},
        {to: '/docs/api/', label: 'API', position: 'left'},
        {
          href: 'https://github.com/zrwusa/data-structure-typed',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://www.npmjs.com/package/data-structure-typed',
          label: 'npm',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Installation', to: '/docs/guide/installation'},
            {label: 'Quick Start', to: '/docs/guide/quick-start'},
            {label: 'API Reference', to: '/docs/api/'},
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'GitHub', href: 'https://github.com/zrwusa/data-structure-typed'},
            {label: 'npm', href: 'https://www.npmjs.com/package/data-structure-typed'},
            {label: 'Changelog', href: 'https://github.com/zrwusa/data-structure-typed/blob/main/CHANGELOG.md'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Pablo Zeng. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    algolia: {
      appId: '2CK3V43PRR',
      apiKey: 'ab7ce559e3114987b4f26430427409ae',
      indexName: 'data-structure-typed-docs-crawler',
      contextualSearch: true,
      searchPagePath: 'search',
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
