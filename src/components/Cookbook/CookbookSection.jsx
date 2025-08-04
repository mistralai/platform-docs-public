import CookbookCard from './CookbookCard';

const CookbookSection = ({ title, sectionItems, styles, viewAllLink = null }) => {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      {
        !sectionItems?.length ? (
          <div className={styles.nothingHere}>There is nothing here...</div>
        ) : (
          <>
            <div className={styles.cookBookItemsContainer}>
              {
                sectionItems.map((item, index) => (
                  <CookbookCard 
                    key={index} 
                    item={item} 
                    styles={styles} 
                  />
                ))
              }
            </div>
            {
              viewAllLink ? (
                <a className="cookbook-view-all" href={viewAllLink}>View all</a>
              ) : null
            }
          </>
        )
      }
    </section>
  );
};

export default CookbookSection;