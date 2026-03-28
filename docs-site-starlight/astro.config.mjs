import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightTypeDoc, { typeDocSidebarGroup } from 'starlight-typedoc';

export default defineConfig({
  integrations: [
    starlight({
      title: 'data-structure-typed',
      description: 'JavaScript/TypeScript Data Structure Library — STL-like, zero-dependency',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/zrwusa/data-structure-typed' },
      ],
      editLink: {
        baseUrl: 'https://github.com/zrwusa/data-structure-typed/edit/main/docs-site-starlight/',
      },
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Installation', slug: 'guide/installation' },
            { label: 'Quick Start', slug: 'guide/quick-start' },
          ],
        },
        {
          label: 'Learn',
          items: [
            { label: 'Core Concepts', slug: 'guide/concepts' },
            { label: 'Data Structures Overview', slug: 'guide/overview' },
            { label: 'Real-World Examples', slug: 'guide/guides' },
            { label: 'Framework Integration', slug: 'guide/integrations' },
          ],
        },
        {
          label: 'Deep Dive',
          items: [
            { label: 'Architecture', slug: 'guide/architecture' },
            { label: 'Performance Benchmarks', slug: 'guide/performance' },
          ],
        },
        typeDocSidebarGroup,
      ],
      plugins: [
        starlightTypeDoc({
          entryPoints: ['../src/data-structures'],
          tsconfig: '../tsconfig.json',
          typeDoc: {
            excludeProtected: false,
            excludePrivate: true,
            excludeNotDocumented: true,
            readme: 'none',
            plugin: ['../scripts/typedoc-plugin-example-rewrite.js'],
          },
        }),
      ],
    }),
  ],
  site: 'https://data-structure-typed-docs.vercel.app',
});
