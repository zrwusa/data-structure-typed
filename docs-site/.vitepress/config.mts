import { defineConfig } from 'vitepress';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadApiSidebar() {
  const sidebarPath = path.resolve(__dirname, '../api/typedoc-sidebar.json');
  if (fs.existsSync(sidebarPath)) {
    return JSON.parse(fs.readFileSync(sidebarPath, 'utf-8'));
  }
  return [{ text: 'API Reference', items: [{ text: 'Overview', link: '/api/' }] }];
}

export default defineConfig({
  vue: {
    template: {
      compilerOptions: {
        // TypeScript generics like <E>, <V, K>, <VO>, etc. appear in TypeDoc markdown.
        // Treat them as custom elements so Vue doesn't try to resolve them as components.
        isCustomElement: (tag) =>
          /^[A-Z][A-Z0-9]*$/.test(tag) ||           // E, V, K, VO, EO, etc.
          /^[A-Z][a-z]+[A-Z]/.test(tag) ||           // MapEdge, TreeNode, etc.
          tag.includes(',')                            // multi-param generics
      }
    }
  },
  title: 'data-structure-typed',
  description: 'JavaScript/TypeScript Data Structure Library — STL-like, zero-dependency',
  base: '/',
  cleanUrls: true,

  head: [
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'data-structure-typed' }],
    ['meta', { property: 'og:description', content: 'JavaScript/TypeScript Data Structure Library' }],
    ['meta', { property: 'og:url', content: 'https://data-structure-typed-docs.vercel.app' }]
  ],

  sitemap: {
    hostname: 'https://data-structure-typed-docs.vercel.app'
  },

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/installation' },
      { text: 'API', link: '/api/' },
      { text: 'Performance', link: '/guide/performance' },
      {
        text: 'Links',
        items: [
          { text: 'npm', link: 'https://www.npmjs.com/package/data-structure-typed' },
          { text: 'GitHub', link: 'https://github.com/zrwusa/data-structure-typed' },
          { text: 'Changelog', link: 'https://github.com/zrwusa/data-structure-typed/blob/main/CHANGELOG.md' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' }
          ]
        },
        {
          text: 'Learn',
          items: [
            { text: 'Core Concepts', link: '/guide/concepts' },
            { text: 'Data Structures Overview', link: '/guide/overview' },
            { text: 'Real-World Examples', link: '/guide/guides' },
            { text: 'Framework Integration', link: '/guide/integrations' }
          ]
        },
        {
          text: 'Deep Dive',
          items: [
            { text: 'Architecture', link: '/guide/architecture' },
            { text: 'Performance Benchmarks', link: '/guide/performance' }
          ]
        }
      ],
      '/api/': loadApiSidebar()
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zrwusa/data-structure-typed' }
    ],

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/zrwusa/data-structure-typed/edit/main/docs-site/:path'
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Pablo Zeng'
    }
  }
});
