import * as React from 'react';
import type { SVGProps } from 'react';
const ClockIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#clock_svg__a)">
      <path d="M8.25 5.75h-2.5v2.5h2.5zM18.25 8.25v7.5h2.5v-7.5zv-2.5h-2.5v2.5zM15.75 3.25h-7.5v2.5h7.5zM18.25 15.75h-2.5v2.5h2.5zM5.75 18.25h2.5v2.5h7.5v-2.5h-7.5v-2.5h-2.5zM10.75 8.25v5h5v-2.5h-2.5v-2.5zM5.75 8.25h-2.5v7.5h2.5z" />
    </g>
    <defs>
      <clipPath id="clock_svg__a">
        <path fill="#fff" d="M3.25 3.25h17.5v17.5H3.25z" />
      </clipPath>
    </defs>
  </svg>
);
export default ClockIcon;
