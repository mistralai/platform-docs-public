import * as React from 'react';
import type { SVGProps } from 'react';
const FlagIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#flag_svg__a)">
      <path d="M19.5 5.75H12v2.5h5v5.002h-5v2.5l7.5-.002zM4.5 20.75H7v-7.5h5v-2.5H7V5.749h5v-2.5l-7.5.001z" />
    </g>
    <defs>
      <clipPath id="flag_svg__a">
        <path fill="#fff" d="M4.5 3.25h15v17.5h-15z" />
      </clipPath>
    </defs>
  </svg>
);
export default FlagIcon;
