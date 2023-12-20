import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Deploy',
    description: (
      <>
        Mistral AI API follows OpenAI conventions for plug-and-play replacement.
      </>
    ),
  },
  {
    title: 'Private by Default',
    description: (
      <>
        Our API runs in your cloud. We never see your data.
      </>
    ),
  },
  {
    title: 'The best Open Source LLMs',
    description: (
      <>
        Our top level team of researchers and engineers are working on the best open source models.
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
