import * as React from 'react';
import type { SVGProps } from 'react';
const ChevronDownIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#left-2_svg__a)">
      <path d="M10.75 14.5V17h2.5v-2.5zM8.25 12v2.5h2.5V12zM13.25 12v2.5h2.5V12zM15.75 9.5V12h2.5V9.5zM18.25 7v2.5h2.5V7zM5.75 9.5V12h2.5V9.5zM3.25 7v2.5h2.5V7z" />
    </g>
    <defs>
      <clipPath id="left-2_svg__a">
        <path fill="#fff" d="M3.25 17V7h17.5v10z" />
      </clipPath>
    </defs>
  </svg>
);
export default ChevronDownIcon;
