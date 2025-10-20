import * as React from 'react';
import type { SVGProps } from 'react';
const FolderIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g clipPath="url(#folder_svg__a)">
      <path
        fill="currentColor"
        d="M20.75 7h-10V4.5h-7.5v15h17.5zm-2.5 10H5.75V7h2.5v2.5h10z"
      />
    </g>
    <defs>
      <clipPath id="folder_svg__a">
        <path fill="#fff" d="M3.25 4.5h17.5v15H3.25z" />
      </clipPath>
    </defs>
  </svg>
);
export default FolderIcon;
