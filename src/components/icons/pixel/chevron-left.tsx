import * as React from 'react';
import type { SVGProps } from 'react';
const ChevronLeftIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#left_svg__a)">
      <path d="M9.5 10.75H7v2.5h2.5zM12 8.25H9.5v2.5H12zM12 13.25H9.5v2.5H12zM14.5 15.75H12v2.5h2.5zM17 18.25h-2.5v2.5H17zM14.5 5.75H12v2.5h2.5zM17 3.25h-2.5v2.5H17z" />
    </g>
    <defs>
      <clipPath id="left_svg__a">
        <path fill="#fff" d="M7 3.25h10v17.5H7z" />
      </clipPath>
    </defs>
  </svg>
);

export default ChevronLeftIcon;
