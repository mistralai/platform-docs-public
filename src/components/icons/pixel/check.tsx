import * as React from 'react';
import type { SVGProps } from 'react';
const CheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#check_svg__a)">
      <path d="M10.75 15.75h-2.5v2.5h2.5zM13.25 13.25h-2.5v2.5h2.5zM20.75 5.75h-2.5v2.5h-2.5v2.5h-2.5v2.5h2.5v-2.5h2.5v-2.5h2.5zM8.25 13.25h-2.5v2.5h2.5zM5.75 10.75h-2.5v2.5h2.5z" />
    </g>
    <defs>
      <clipPath id="check_svg__a">
        <path fill="#fff" d="M3.25 5.75h17.5v12.5H3.25z" />
      </clipPath>
    </defs>
  </svg>
);
export default CheckIcon;
