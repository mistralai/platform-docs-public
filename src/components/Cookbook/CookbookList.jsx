// CookbookList.jsx
import { useState, useMemo, useEffect } from "react";
import Link from "@docusaurus/Link";
import CustomSelect from "./CustomSelect";
import CustomRouting from "./CustomRouting";
import { filterCookbooks, getNotebookTitle } from "../../../libs/utils";

const CookbookList = ({ allCookbooks, styles, filterOptions }) => {
  const [useCaseFilter, setUseCaseFilter] = useState([]);
  const [integrationFilter, setIntegrationFilter] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [titles, setTitles] = useState({});

  // Memoize the cookbooks that need title extraction
  const cookbooksNeedingTitles = useMemo(() => {
    return allCookbooks.filter(cookbook =>
      !cookbook.title || cookbook.title.trim() === ""
    );
  }, [allCookbooks]);

  useEffect(() => {
    const fetchTitles = async () => {
      const newTitles = {};

      // Create an array of promises for title fetching
      const titlePromises = cookbooksNeedingTitles.map(async (cookbook) => {
        if (cookbook.path) {
          const title = await getNotebookTitle(cookbook.path);
          if (title) {
            newTitles[cookbook.path] = title;
          }
        }
      });

      // Wait for all title fetching to complete
      await Promise.all(titlePromises);
      setTitles(prev => ({ ...prev, ...newTitles }));
    };

    if (cookbooksNeedingTitles.length > 0) {
      fetchTitles();
    }
  }, [cookbooksNeedingTitles]);

  const handleChangeSelectForUseCases = (selectedOptions) => {
    setUseCaseFilter(selectedOptions.map(option => option.value));
  };

  const handleChangeSelectForIntegrations = (selectedOptions) => {
    setIntegrationFilter(selectedOptions.map(option => option.value));
  };

  const getDisplayTitle = (item) => {
    // First try the title from config if it's not empty
    if (item.title && item.title.trim() !== "") {
      return item.title;
    }
    // Then try the extracted title from notebook
    if (titles[item.path]) {
      return titles[item.path];
    }
    // Fallback to generating a title from the path
    return generateTitleFromPath(item.path);
  };

  const generateTitleFromPath = (path) => {
    if (!path) return "Untitled Cookbook";

    // Remove file extensions and README
    let title = path.split('/').pop()
      .replace('.ipynb', '')
      .replace('.md', '')
      .replace('README', '');

    // Convert kebab-case and snake_case to normal case
    title = title.replace(/[-_]/g, ' ');

    // Capitalize first letter of each word
    return title.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const filteredCookbooks = useMemo(() => {
    return filterCookbooks(
      allCookbooks,
      useCaseFilter,
      integrationFilter,
      [],
      searchTerm
    );
  }, [allCookbooks, useCaseFilter, integrationFilter, searchTerm]);

  const renderTags = (item) => {
    const integrations = item?.labels?.integrations || [];
    const useCases = item?.labels?.useCases || [];
    return [...integrations, ...useCases].map((label, idx) => (
      <div key={`${item.path}-${label}-${idx}`} className={styles.tag}>
        {label}
      </div>
    ));
  };

  return (
    <div>
      <div className={styles.cookbookListHeader}>
        <h2 className={styles.cookbookListTitle}>All cookbooks</h2>
        <div className={styles.filterSelectContainers}>
          <input
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            className={styles.filterInput}
            placeholder="Search cookbooks"
          />
          <CustomSelect
            options={filterOptions.integrations}
            placeHolder="Integration"
            align="right"
            onChange={handleChangeSelectForIntegrations}
            isSearchable
            isMulti
          />
          <CustomSelect
            options={filterOptions.useCases}
            placeHolder="Use Case"
            align="right"
            onChange={handleChangeSelectForUseCases}
            isSearchable
            isMulti
          />
        </div>
      </div>
      <div className={styles.cookbookList}>
        {filteredCookbooks.length > 0 ? (
          filteredCookbooks.map((item) => (
            <Link
              to={CustomRouting({ item })}
              key={item.path}
              className={styles.cookbookItem}
            >
              <span className={styles.cookbookItemTitle}>
                {getDisplayTitle(item)}
              </span>
              {(item.labels?.integrations?.length > 0 ||
                item.labels?.useCases?.length > 0) && (
                <div className={styles.cookbookItemTags}>
                  {renderTags(item)}
                </div>
              )}
            </Link>
          ))
        ) : (
          <div className={styles.nothingHere}>No cookbooks found matching your criteria</div>
        )}
      </div>
    </div>
  );
};

export default CookbookList;