import * as React from 'react';
import type { SVGProps } from 'react';
const ChevronUpIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#left-3_svg__a)">
      <path d="M13.25 9.5V7h-2.5v2.5zM15.75 12V9.5h-2.5V12zM10.75 12V9.5h-2.5V12zM8.25 14.5V12h-2.5v2.5zM5.75 17v-2.5h-2.5V17zM18.25 14.5V12h-2.5v2.5zM20.75 17v-2.5h-2.5V17z" />
    </g>
    <defs>
      <clipPath id="left-3_svg__a">
        <path fill="#fff" d="M20.75 7v10H3.25V7z" />
      </clipPath>
    </defs>
  </svg>
);
export default ChevronUpIcon;
