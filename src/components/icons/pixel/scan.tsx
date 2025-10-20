import * as React from 'react';
import type { SVGProps } from 'react';
const ScanIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#scan_svg__a)">
      <path d="M5.75 5.75h2.5v-2.5h-5v5h2.5zM20.75 3.25h-5v2.5h2.5v2.5h2.5zM20.75 18.25v-2.5h-2.5v2.5h-2.5v2.5h5zM3.25 20.75h5v-2.5h-2.5v-2.5h-2.5z" />
    </g>
    <defs>
      <clipPath id="scan_svg__a">
        <path fill="#fff" d="M3.25 3.25h17.5v17.5H3.25z" />
      </clipPath>
    </defs>
  </svg>
);
export default ScanIcon;
