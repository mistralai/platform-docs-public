import * as React from 'react';
import type { SVGProps } from 'react';
const RetryIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#retry_svg__a)">
      <path d="M9.5 15.75H7v2.5h2.5zM19.5 15.75H17v2.5h2.5zM19.5 5.75H17v2.5h2.5zM9.5 5.75H7v2.5h2.5z" />
      <path d="M4.5 5.75H2v7.5h7.5v-2.5H7v-2.5H4.5zM22 8.25h-2.5v7.5H22zM17 18.25H9.5v2.5H17zM17 3.25H9.5v2.5H17z" />
    </g>
    <defs>
      <clipPath id="retry_svg__a">
        <path fill="#fff" d="M2 3.25h20v17.5H2z" />
      </clipPath>
    </defs>
  </svg>
);
export default RetryIcon;
