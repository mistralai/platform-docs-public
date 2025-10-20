import * as React from 'react';
import type { SVGProps } from 'react';
const RefreshIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#refresh_svg__a)">
      <path d="M5.75 7h-2.5v2.5h2.5zM8.25 4.5h-2.5V7h2.5zM8.25 2v2.5h7.5V2zM18.25 4.5h-2.5V7h2.5z" />
      <path d="M20.75 7h-2.5v2.5h-2.5V12h7.5V4.5h-2.5zM20.75 14.5h-2.5V17h2.5zM18.25 17h-2.5v2.5h2.5zM10.75 22h5v-2.5h-7.5V22zM8.25 17h-2.5v2.5h2.5z" />
      <path d="M3.25 17h2.5v-2.5h2.5V12H.75v7.5h2.5z" />
    </g>
    <defs>
      <clipPath id="refresh_svg__a">
        <path fill="#fff" d="M.75 2h22.5v20H.75z" />
      </clipPath>
    </defs>
  </svg>
);
export default RefreshIcon;
