import * as React from 'react';
import type { SVGProps } from 'react';
const FolderIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 70 60"
    fill="none"
    {...props}
  >
    <g clipPath="url(#folder_svg__a)">
      <path
        fill="currentColor"
        d="M69.998 9.999H29.998V0H-0.002V60H69.998V9.999ZM59.998 49.999H9.998V9.999H19.998V19.999H59.998V49.999Z"
      />
    </g>
    <defs>
      <clipPath id="folder_svg__a">
        <rect width="70" height="60" fill="#fff" />
      </clipPath>
    </defs>
  </svg>
);
export default FolderIcon;
