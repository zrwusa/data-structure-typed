import React, { useEffect } from 'react';
import TOCItems from '@theme-original/TOCItems';
import type { WrapperProps } from '@docusaurus/types';

type Props = WrapperProps<typeof TOCItems>;

export default function TOCItemsWrapper(props: Props): React.JSX.Element {
  useEffect(() => {
    // Auto-scroll active TOC item into view
    const observer = new MutationObserver(() => {
      const active = document.querySelector('.table-of-contents__link--active');
      if (active) {
        const container = active.closest('.theme-doc-toc-desktop');
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const activeRect = active.getBoundingClientRect();
          // Only scroll if active item is outside visible area
          if (activeRect.top < containerRect.top || activeRect.bottom > containerRect.bottom) {
            active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          }
        }
      }
    });

    const toc = document.querySelector('.table-of-contents');
    if (toc) {
      observer.observe(toc, { attributes: true, subtree: true, attributeFilter: ['class'] });
    }

    return () => observer.disconnect();
  }, []);

  return <TOCItems {...props} />;
}
