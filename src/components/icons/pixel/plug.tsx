import * as React from 'react';
import type { SVGProps } from 'react';
const PlugIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g clipPath="url(#plug_svg__a)">
      <path
        fill="currentColor"
        d="M18.25 7h-2.5V2h-2.5v5h-2.5V2h-2.5v5H5.749v7.5h2.5V17h2.5v5h2.5v-5h2.5v-2.5h-7.5v-5h7.5v5h2.5v-5h.001z"
      />
    </g>
    <defs>
      <clipPath id="plug_svg__a">
        <path fill="#fff" d="M5.75 2h12.5v20H5.75z" />
      </clipPath>
    </defs>
  </svg>
);
export default PlugIcon;
