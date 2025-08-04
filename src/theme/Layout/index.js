import { useState, useEffect } from "react";
import Layout from "@theme-original/Layout";
import { useLocation } from "@docusaurus/router";
import IpynbViewer from "../../components/Cookbook/IpynbViewer";
import IpynbViewerSkeleton from "../../components/Cookbook/IpynbViewerSkeleton";
import MarkdownViewer from "../../components/Cookbook/MarkdownViewer";

export default function LayoutWrapper(props) {
  const { pathname } = useLocation();
  const pathSegments = pathname.split("/").filter(Boolean);

  // Correctly format the path
  let path = pathname.startsWith('/cookbooks/')
    ? pathname.substring('/cookbooks/'.length)
    : pathname;
  path = path.replace(/(^\/+|\/+$)/g, ''); // Remove leading and trailing slashes

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (pathSegments[0] === "cookbooks" && path) {
    const fileType = path.endsWith('.ipynb') ? 'ipynb' : 'md';
    const Viewer = fileType === 'ipynb' ? IpynbViewer : MarkdownViewer;

    if (isLoading) {
      return (
        <Layout {...props}>
          <IpynbViewerSkeleton />
          <div className="hidden-indexer">
            <Viewer path={path} />
          </div>
        </Layout>
      );
    }

    return (
      <Layout {...props}>
        <Viewer path={path} />
      </Layout>
    );
  }

  return <Layout {...props} />;
}