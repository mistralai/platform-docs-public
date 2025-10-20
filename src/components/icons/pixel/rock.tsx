import * as React from 'react';
import type { SVGProps } from 'react';
const RockIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#rock_svg__a)">
      <path d="M7 18.25h2.5v2.5H17v-2.5h2.5v-15H17v7.5h-5v-7.5H9.5v12.5H6.999z" />
      <path d="M7 13.25H4.5v2.5H7z" />
    </g>
    <defs>
      <clipPath id="rock_svg__a">
        <path fill="#fff" d="M4.5 3.25h15v17.5h-15z" />
      </clipPath>
    </defs>
  </svg>
);
export default RockIcon;
