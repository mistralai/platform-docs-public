import CookbookSection from './CookbookSection';

const CookbookSections = ({ notebooks, styles }) => {
  // Group notebooks by their labels or any other criteria from the config file
  const featuredNotebooks = notebooks.filter(notebook => notebook.mainSection.featured === "True");
  const latestNotebooks = notebooks.filter(notebook => notebook.mainSection.latest === "True");

  return (
    <div>
      {featuredNotebooks.length > 0 && (
        <CookbookSection
          title="Featured"
          sectionItems={featuredNotebooks}
          styles={styles}
        />
      )}
      {latestNotebooks.length > 0 && (
        <CookbookSection
          title="Latest"
          sectionItems={latestNotebooks}
          styles={styles}
        />
      )}
    </div>
  );
};

export default CookbookSections;