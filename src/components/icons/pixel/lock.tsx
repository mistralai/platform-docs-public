import * as React from 'react';
import type { SVGProps } from 'react';
const LockIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#lock_svg__a)">
      <path d="M15.75 18.25h-7.5v2.5h7.5zM15.75 3.25h-7.5v2.5h7.5zM13.25 13.25h-2.5v2.5h2.5z" />
      <path d="M8.25 10.75h7.5v7.5h2.5V5.75h-2.5v2.5h-7.5v-2.5h-2.5v12.5h2.5z" />
    </g>
    <defs>
      <clipPath id="lock_svg__a">
        <path fill="#fff" d="M5.75 3.25h12.5v17.5H5.75z" />
      </clipPath>
    </defs>
  </svg>
);
export default LockIcon;
