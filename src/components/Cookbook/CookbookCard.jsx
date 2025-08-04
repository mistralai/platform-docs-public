import { useMemo, useState, useEffect } from "react";
import Link from "@docusaurus/Link";
import CustomRouting from "./CustomRouting";
import { getNotebookTitle } from "../../../libs/utils";

const CookbookCard = ({ item, styles }) => {
  const [title, setTitle] = useState(null);

  useEffect(() => {
    const fetchTitle = async () => {
      // Only fetch title if it's not provided or empty
      if (!item.title || item.title.trim() === "") {
        const extractedTitle = await getNotebookTitle(item.path);
        if (extractedTitle) {
          setTitle(extractedTitle);
        }
      }
    };

    fetchTitle();
  }, [item]);

  const getDisplayTitle = () => {
    // First try the title from props if it's not empty
    if (item.title && item.title.trim() !== "") {
      return item.title;
    }
    // Then try the extracted title
    if (title) {
      return title;
    }
    // Fallback to generating a title from the path
    return generateTitleFromPath(item.path);
  };

  const generateTitleFromPath = (path) => {
    if (!path) return "Untitled Cookbook";

    // Handle README files specially
    if (path.endsWith('README.md')) {
      const dirName = path.split('/').slice(-2, -1)[0];
      return dirName
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    // Handle other files
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

  const renderTags = useMemo(() => {
    const integrations = Array.isArray(item?.labels?.integrations) ? item.labels.integrations : [];
    const useCases = Array.isArray(item?.labels?.useCases) ? item.labels.useCases : [];
    const tagsArray = [...integrations, ...useCases];

    return tagsArray.map((label, idx) => (
      <div key={`${item.path}-${label}-${idx}`} className={styles.tag}>
        {label}
      </div>
    ));
  }, [item, styles.tag]);

  return (
    <Link
      className={styles.cookBookItem}
      to={CustomRouting({ item })}
    >
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>{getDisplayTitle()}</div>
      </div>
      {(item.labels?.integrations?.length > 0 || item.labels?.useCases?.length > 0) && (
        <div className={styles.cardFooter}>
          <div className={styles.tags}>{renderTags}</div>
          <span className={styles.goToArrowBtn}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.goToArrowIcon}
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
        </div>
      )}
    </Link>
  );
};

export default CookbookCard;