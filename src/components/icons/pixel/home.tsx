import * as React from 'react';
import type { SVGProps } from 'react';
const HomeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#home_svg__a)">
      <path d="M13.25 3.25h-2.5v2.5h2.5zM18.25 20.75v-7.5h-2.5v5h-2.5v-5h-2.5v5h-2.5v-5h-2.5v7.5zM10.75 5.75h-2.5v2.5h2.5zM15.75 5.75h-2.5v2.5h2.5zM8.25 8.25h-2.5v2.5h2.5zM18.25 8.25h-2.5v2.5h2.5zM5.75 10.75h-2.5v2.5h2.5zM20.75 10.75h-2.5v2.5h2.5z" />
    </g>
    <defs>
      <clipPath id="home_svg__a">
        <path fill="#fff" d="M3.25 3.25h17.5v17.5H3.25z" />
      </clipPath>
    </defs>
  </svg>
);
export default HomeIcon;
