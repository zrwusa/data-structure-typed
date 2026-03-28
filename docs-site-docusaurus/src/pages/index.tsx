import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/guide/installation">
            Get Started →
          </Link>
          <Link className="button button--secondary button--lg" to="/docs/api/">
            API Reference
          </Link>
        </div>
      </div>
    </header>
  );
}

const features = [
  {
    title: '🏠 Uniform API',
    description: 'push, pop, shift, map, filter, reduce — same methods across all structures. Learn once, use everywhere.',
  },
  {
    title: '🛡️ Type Safe',
    description: 'Full generics with strict TypeScript support. Every method returns the correct type — no casting needed.',
  },
  {
    title: '✨ Zero Friction',
    description: 'Spread it [...tree], loop it for...of, pass it to new Set(). Works with every JavaScript API out of the box.',
  },
  {
    title: '📦 Zero Dependencies',
    description: 'Pure TypeScript. No runtime dependencies. Tree-shakeable with subpath exports — bundle only what you use.',
  },
  {
    title: '✅ Battle-Tested',
    description: '2500+ tests, 99%+ coverage. CLRS-correct Red-Black Tree, ACL-style Segment Tree. Production-ready.',
  },
];

export default function Home(): React.JSX.Element {
  return (
    <Layout title="Home" description="JavaScript/TypeScript Data Structure Library — STL-like, zero-dependency">
      <HomepageHeader />
      <main>
        <section style={{padding: '4rem 0'}}>
          <div className="container">
            <div className="row" style={{justifyContent: 'center'}}>
              {features.map((f, i) => (
                <div key={i} className={clsx('col col--4')} style={{marginBottom: '2rem'}}>
                  <h3>{f.title}</h3>
                  <p>{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
