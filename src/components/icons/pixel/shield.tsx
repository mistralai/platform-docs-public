import * as React from 'react';
import type { SVGProps } from 'react';
const ShieldIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#shield_svg__a)">
      <path d="M9.5 15.75H7v2.5h2.5z" />
      <path d="M7 10.75h5v-5h4.999v5h-5v7.5H9.5v2.5h5v-2.5H17v-2.5h2.5V3.25h-15v12.5h2.5z" />
    </g>
    <defs>
      <clipPath id="shield_svg__a">
        <path fill="#fff" d="M4.5 3.25h15v17.5h-15z" />
      </clipPath>
    </defs>
  </svg>
);
export default ShieldIcon;
