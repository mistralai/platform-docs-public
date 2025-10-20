import * as React from 'react';
import type { SVGProps } from 'react';
const FireIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g clipPath="url(#fire_svg__a)">
      <path
        fill="currentColor"
        d="M5.75 18.25h2.5v2.5h7.5v-2.5h-7.5v-2.5h2.5v-2.5h2.5v2.5h2.5v2.5h2.5v-2.5h2.5v-7.5h-2.5v2.5h-2.5v-2.5h-2.5v-5h-2.5v2.5h-2.5v7.5h-2.5v-2.5h-2.5v5h2.5z"
      />
    </g>
    <defs>
      <clipPath id="fire_svg__a">
        <path fill="#fff" d="M3.25 3.25h17.5v17.5H3.25z" />
      </clipPath>
    </defs>
  </svg>
);
export default FireIcon;
