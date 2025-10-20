import * as React from 'react';
import type { SVGProps } from 'react';
const KeyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#key_svg__a)">
      <path d="M18.25 4.5h-2.5v5h2.5zM15.75 2h-7.5v2.5h-2.5v5h2.5V12h2.5v10h5v-2.5h-2.5V17h2.5v-2.5h-2.5V12h2.5V9.5h-7.5v-5h7.5z" />
    </g>
    <defs>
      <clipPath id="key_svg__a">
        <path fill="#fff" d="M5.75 2h12.5v20H5.75z" />
      </clipPath>
    </defs>
  </svg>
);
export default KeyIcon;
