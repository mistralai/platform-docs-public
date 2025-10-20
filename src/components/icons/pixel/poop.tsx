import * as React from 'react';
import type { SVGProps } from 'react';
const PoopIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#poop_svg__a)">
      <path d="M3.25 22h15v-5h-2.5v-2.5h-2.5V12h-2.5V9.5h-2.5v5h-2.5V17h-2.5zM18.25 9.5h-2.5V12h2.5zM20.75 7h-2.5v2.5h2.5zM18.25 4.5h-2.5V7h2.5zM3.25 9.5h2.5V7h2.5V4.5h-2.5V7h-2.5zM5.75 2h-2.5v2.5h2.5z" />
    </g>
    <defs>
      <clipPath id="poop_svg__a">
        <path fill="#fff" d="M3.25 2h17.5v20H3.25z" />
      </clipPath>
    </defs>
  </svg>
);
export default PoopIcon;
