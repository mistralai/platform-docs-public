import * as React from 'react';
import type { SVGProps } from 'react';
const TvIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#tv_svg__a)">
      <path d="M20.749 7h-5V4.5h-2.5V7h-2.5V4.5h-2.5V7h-5v15h17.5zm-2.5 12.5H5.75v-10h12.5z" />
      <path d="M15.75 12h-7.5v5h7.5zM8.25 2h-2.5v2.5h2.5zM18.25 2h-2.5v2.5h2.5z" />
    </g>
    <defs>
      <clipPath id="tv_svg__a">
        <path fill="#fff" d="M3.25 2h17.5v20H3.25z" />
      </clipPath>
    </defs>
  </svg>
);
export default TvIcon;
