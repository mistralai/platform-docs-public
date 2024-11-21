import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Use',
    icon: '🚀',
    description: (
      <>
        Mistral AI was designed from the ground up to be easily installed and
        used to get your applications up and running quickly.
      </>
    ),
  },
  {
    title: 'State-of-the-Art Models',
    icon: '🎯',
    description: (
      <>
        Access cutting-edge language models optimized for various tasks.
        From text generation to code completion, we've got you covered.
      </>
    ),
  },
  {
    title: 'Powerful APIs',
    icon: '⚡',
    description: (
      <>
        Leverage our robust API infrastructure for seamless integration.
        Built with performance and reliability in mind.
      </>
    ),
  },
  {
    title: 'Enterprise Ready',
    icon: '🏢',
    description: (
      <>
        Production-grade infrastructure with high availability,
        scalability, and enterprise-level security features.
      </>
    ),
  },
  {
    title: 'Community Driven',
    icon: '👥',
    description: (
      <>
        Join our thriving community of developers and researchers.
        Share experiences, contribute, and grow together.
      </>
    ),
  },
  {
    title: 'Comprehensive Documentation',
    icon: '📚',
    description: (
      <>
        Detailed guides, API references, and examples to help you
        make the most of Mistral AI's capabilities.
      </>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureCard}>
        <div className={styles.featureIconWrapper}>
          <span className={styles.featureIcon}>{icon}</span>
        </div>
        <div className="padding-horiz--md">
          <h3 className={styles.featureTitle}>{title}</h3>
          <p className={styles.featureDescription}>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featureGrid}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
