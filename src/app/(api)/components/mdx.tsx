"use client";

import { ComponentProps } from "react";
import styles from "./styles.module.css";

type HeadingProps = ComponentProps<"h1"> & {
  id?: string;
};

// Inline Link icon SVG component
const LinkIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

export const HeadingWrapper = ({
  children,
  id,
  className,
  tag: Tag = "h1",
}: HeadingProps & { tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" }) => {
  const copyToClipboard = () => {
    if (id) {
      const url = `${window.location.origin}${window.location.pathname}#${id}`;
      navigator.clipboard.writeText(url);
      // Also set the fragment in the current URL
      window.location.hash = id;
    }
  };

  return (
    <div className={styles.headingContainer}>
      <Tag id={id} className={className}>
        {children}
        {id && (
          <button
            onClick={copyToClipboard}
            className={styles.copyLinkButton}
            aria-label="Copy link to this heading"
            title="Copy link"
          >
            <LinkIcon size={16} />
          </button>
        )}
      </Tag>
    </div>
  );
};
