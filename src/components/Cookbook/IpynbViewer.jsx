// IpynbViewer.jsx
import { useLayoutEffect, useState, useEffect } from "react";
import IpynbViewerSkeleton from "./IpynbViewerSkeleton";
import styles from "../../pages/index.module.css";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import { processIpynbAttachments, fetchAndProcessNotebook, extractTitleFromNotebook } from "../../../libs/utils";

let IpynbRendererModule = null;

if (ExecutionEnvironment.canUseDOM) {
  IpynbRendererModule = require("react-ipynb-renderer");
}

const COOKBOOK_GITHUB_PREFIX = "https://github.com/mistralai/cookbook/blob/main/";
const COOKBOOK_COLAB_PREFIX = "https://colab.research.google.com/github/mistralai/cookbook/blob/main/";

export default function IpynbViewer({ notebookData, path, isMarkdown = false }) {
  const [ipynbFile, setIpynbFile] = useState(null);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .react-ipynb-renderer table {
        color: var(--ifm-font-color-base) !important;
      }
      .react-ipynb-renderer th {
        color: var(--ifm-font-color-base) !important;
      }
      .react-ipynb-renderer td {
        color: var(--ifm-font-color-base) !important;
      }
      .react-ipynb-renderer table, .react-ipynb-renderer th, .react-ipynb-renderer td {
        border-color: var(--ifm-table-border-color) !important;
      }
      .react-ipynb-renderer pre {
        background-color: var(--ifm-pre-background) !important;
        color: var(--ifm-code-color) !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useLayoutEffect(() => {
    const loadNotebook = async () => {
      try {
        let processedJsonData;
        if (notebookData) {
          const basePath = path ? path.substring(0, path.lastIndexOf('/')) : '';
          processedJsonData = processIpynbAttachments(notebookData, basePath);
        } else if (path) {
          processedJsonData = await fetchAndProcessNotebook(path);
        } else {
          throw new Error("No notebook data or path provided");
        }

        setIpynbFile(processedJsonData);

        if (processedJsonData) {
          const extractedTitle = extractTitleFromNotebook(processedJsonData);
          setTitle(extractedTitle || "");
        }
      } catch (error) {
        console.error("Error loading notebook:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotebook();
  }, [notebookData, path]);

  if (isLoading) return <IpynbViewerSkeleton />;
  if (!ipynbFile) return null;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className='ipynb-container'>
          <div>
            {title && <h1>{title}</h1>}
            {path && (
              <div style={{ display: "flex", gap: "10px" }}>
                <a
                  href={`${COOKBOOK_GITHUB_PREFIX}${path}`}
                  target='_blank'
                  className='btn'
                  style={{ display: "flex", alignItems: "center", width: "fit-content" }}
                >
                  <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' className='bi bi-github' viewBox='0 0 16 16' style={{ marginRight: "8px" }}>
                    <path d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z' />
                  </svg>
                  View on GitHub
                </a>
                {!isMarkdown && (
                  <a
                    href={`${COOKBOOK_COLAB_PREFIX}${path}`}
                    target='_blank'
                    className='btn'
                    style={{ display: "flex", alignItems: "center", width: "fit-content" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill='currentColor' className='bi bi-colab' viewBox="0 0 48 48" style={{ marginRight: "8px" }}>
                      <path fill="#ffb300" d="M33.5,10C26.044,10,20,16.044,20,23.5C20,30.956,26.044,37,33.5,37S47,30.956,47,23.5 C47,16.044,40.956,10,33.5,10z M33.5,30c-3.59,0-6.5-2.91-6.5-6.5s2.91-6.5,6.5-6.5s6.5,2.91,6.5,6.5S37.09,30,33.5,30z"/>
                      <path fill="#ffb300" d="M19.14,28.051l0-0.003C17.96,29.252,16.318,30,14.5,30C10.91,30,8,27.09,8,23.5s2.91-6.5,6.5-6.5 c1.83,0,3.481,0.759,4.662,1.976l3.75-6.024C20.604,11.109,17.683,10,14.5,10C7.044,10,1,16.044,1,23.5C1,30.956,7.044,37,14.5,37 c3.164,0,6.067-1.097,8.369-2.919L19.14,28.051z"/>
                      <path fill="#f57c00" d="M8,23.5c0-1.787,0.722-3.405,1.889-4.58l-4.855-5.038C2.546,16.33,1,19.733,1,23.5 c0,3.749,1.53,7.14,3.998,9.586l4.934-4.964C8.74,26.944,8,25.309,8,23.5z"/>
                      <path fill="#f57c00" d="M38.13,18.941C39.285,20.114,40,21.723,40,23.5c0,3.59-2.91,6.5-6.5,6.5 c-1.826,0-3.474-0.755-4.655-1.968l-4.999,4.895C26.298,35.437,29.714,37,33.5,37C40.956,37,47,30.956,47,23.5 c0-3.684-1.479-7.019-3.871-9.455L38.13,18.941z"/>
                    </svg>
                    Open in Colab
                  </a>
                )}
              </div>
            )}
          </div>
          <div id='ipynb-renderer'>
            {IpynbRendererModule && ipynbFile && (
              <IpynbRendererModule.IpynbRenderer
                ipynb={ipynbFile}
                language="python"
                config={{
                  showLineNumbers: true,
                  lineWrap: true
                }}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}