import { useState, useLayoutEffect } from "react";
import Layout from "@theme-original/Layout";
import { useLocation } from "@docusaurus/router";
import IpynbViewer from "../../components/Cookbook/IpynbViewer";
import IpynbViewerSkeleton from "../../components/Cookbook/IpynbViewerSkeleton";
import MarkdownViewer from "../../components/Cookbook/MarkdownViewer";

export default function LayoutWrapper(props) {
  const { pathname } = useLocation();
  const pathSegments = pathname.split("/").filter(Boolean);
  let path = pathname.replace('cookbooks/', '');
  path = path.replace(/(^\/+|\/+$)/g, ''); // Remove leading and trailing slashes

  console.log("my path: ", path);

  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <Layout {...props}>
        <IpynbViewerSkeleton />
      </Layout>
    );
  }

  if (pathSegments[0] === "cookbooks" && path) {
    // Determine the file type and use the appropriate viewer
    const fileType = path.endsWith('.ipynb') ? 'ipynb' : 'md';
    return (
      <Layout {...props}>
        {fileType === 'ipynb' ? <IpynbViewer path={path} /> : <MarkdownViewer path={path} />}
      </Layout>
    );
  }

  return <Layout {...props} />;
}