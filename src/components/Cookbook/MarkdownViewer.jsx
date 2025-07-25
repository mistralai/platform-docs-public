import { useState, useEffect } from "react";
import IpynbViewer from "./IpynbViewer";
import { markdownToNotebook } from "../../../libs/markdownToNotebook";

export default function MarkdownViewer({ path }) {
  const [isLoading, setIsLoading] = useState(true);
  const [notebookData, setNotebookData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMarkdown = async (path) => {
      try {
        const response = await fetch(path);
        if (!response.ok) {
          throw new Error(`Failed to fetch markdown file: ${response.status} ${response.statusText}`);
        }
        const markdownContent = await response.text();

        // Convert markdown to notebook format
        const notebook = markdownToNotebook(markdownContent);

        setNotebookData(notebook);
      } catch (error) {
        console.error("Error loading or converting markdown:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadMarkdown('/' + path);
  }, [path]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!notebookData) return <div>No content to display</div>;

  return <IpynbViewer notebookData={notebookData} path={path} isMarkdown={true} />;
}