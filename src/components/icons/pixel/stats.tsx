import * as React from 'react';
import type { SVGProps } from 'react';
const StatsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#stats_svg__a)">
      <path d="M4.5 14.5H7V12H4.5V2H2v17.5h2.499V22h17.5v-2.5H4.5z" />
      <path d="M9.5 9.5H7V12h2.5zM12 9.5V12h2.5v2.5H17V12h-2.5V9.5zV7H9.5v2.5zM19.5 9.5H17V12h2.5zM22 7h-2.5v2.5H22z" />
    </g>
    <defs>
      <clipPath id="stats_svg__a">
        <path fill="#fff" d="M2 2h20v20H2z" />
      </clipPath>
    </defs>
  </svg>
);
export default StatsIcon;
