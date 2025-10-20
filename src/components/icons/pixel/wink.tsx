import * as React from 'react';
import type { SVGProps } from 'react';
const WinkIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#wink_svg__a)">
      <path d="M8.25 8.25h-2.5v2.5h2.5zM10.75 5.75h-2.5v2.5h2.5zM8.25 3.25h-2.5v2.5h2.5zM5.75 5.75h-2.5v2.5h2.5zM18.25 8.25h-2.5v2.5h2.5zM8.25 15.75h-2.5v2.5h2.5zM15.75 18.252h-7.5v2.5h7.5zM18.25 15.75h-2.5v2.5h2.5zM18.25 8.25h2.5v-2.5h-2.5zM15.75 5.75h-2.5v2.5h2.5z" />
    </g>
    <defs>
      <clipPath id="wink_svg__a">
        <path fill="#fff" d="M3.25 3.25h17.5v17.5H3.25z" />
      </clipPath>
    </defs>
  </svg>
);
export default WinkIcon;
