import * as React from 'react';
import type { SVGProps } from 'react';
const HappyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#happy_svg__a)">
      <path d="M7 4.5H4.5V7H7zM4.5 2H2v2.5h2.5zM4.5 14.5V17H7v2.5h2.5V17H7v-2.5h10V17h2.5v-5h-15zM14.5 19.5h-5V22h5zM4.5 7H2v2.5h2.5z" />
      <path d="M17 17h-2.5v2.5H17zM19.5 4.5H17V7h2.5zM22 2h-2.5v2.5H22zM22 7h-2.5v2.5H22z" />
    </g>
    <defs>
      <clipPath id="happy_svg__a">
        <path fill="#fff" d="M2 2h20v20H2z" />
      </clipPath>
    </defs>
  </svg>
);
export default HappyIcon;
