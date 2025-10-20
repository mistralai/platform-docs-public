import * as React from 'react';
import type { SVGProps } from 'react';
const LeafIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#leaf_svg__a)">
      <path d="M13.25 2h-2.5v2.5h2.5zM8.25 19.5h2.5V22h2.5v-2.5h2.5V17h2.5V7h-2.5v10h-2.5V9.5h-2.5V17h-2.5zM10.75 4.5h-2.5V7h2.5zM15.75 4.5h-2.5V7h2.5zM8.249 7h-2.5v10h2.5z" />
    </g>
    <defs>
      <clipPath id="leaf_svg__a">
        <path fill="#fff" d="M5.75 2h12.5v20H5.75z" />
      </clipPath>
    </defs>
  </svg>
);
export default LeafIcon;
