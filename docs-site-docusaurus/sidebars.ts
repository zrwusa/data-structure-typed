import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  guideSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: ['guide/installation', 'guide/quick-start'],
    },
    {
      type: 'category',
      label: 'Learn',
      items: ['guide/concepts', 'guide/overview', 'guide/guides', 'guide/integrations'],
    },
    {
      type: 'category',
      label: 'Deep Dive',
      items: ['guide/architecture', 'guide/performance'],
    },
  ],
};

export default sidebars;
