import Layout from "@theme/Layout";
import styles from "../index.module.css";
import CookbookSections from "../../components/Cookbook/CookbookSections";
import CookbookList from "../../components/Cookbook/CookbookList";
import notebooksData from '../../../cookbooks.config.json';
import { extractUniqueLabels } from "../../../libs/utils";

export default function Cookbook() {

  // Transform notebooks data to match the expected structure and ensure no duplicates
  const notebooksMap = new Map();
  notebooksData
    .filter(notebook => notebook.availableInDocs === "True")
    .forEach(notebook => {
      if (!notebooksMap.has(notebook.path)) {
        notebooksMap.set(notebook.path, notebook);
      }
    });

  const notebooks = Array.from(notebooksMap.values());


  const { integrations, useCases } = extractUniqueLabels(notebooks);

  return (
    <Layout title="Cookbook" description="MistralAI Cookbooks">
      <main className={styles.main}>
        <div className={styles.container}>
          <CookbookSections 
            notebooks={notebooks} 
            styles={styles} 
          />
          <CookbookList
            allCookbooks={notebooks}
            styles={styles}
            filterOptions={{ integrations, useCases }}
          />
        </div>
      </main>
    </Layout>
  );
}