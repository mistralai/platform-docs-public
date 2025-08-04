import React from "react";
import styles from "../../pages/index.module.css";

function IpynbViewerSkeleton() {
  const skeletons = Array(5).fill(null);
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className="ipynb-container">
          <div className="skeleton skeleton-title"></div>
          {skeletons.map((_, index) => (
            <React.Fragment key={index}>
              <div className="skeleton skeleton-paragraph"></div>
              <div className="skeleton skeleton-paragraph short"></div>
              <div className="skeleton skeleton-code"></div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </main>
  );
}

export default IpynbViewerSkeleton;
