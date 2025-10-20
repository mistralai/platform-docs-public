import * as React from 'react';
import type { SVGProps } from 'react';
const BoatIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#boat_svg__a)">
      <path d="M16.999 23.25v-2.5h2.5v-2.5h-15v2.5H7v2.5zM21.999 15.75v-2.5H19.5v-2.5h-2.499v2.5H14.5v-2.5H17v-2.5h-2.5V.75H12v2.5h-2.5v2.5H12v7.5H6.998v-2.5H9.5l-.001-5h-2.5v2.5h-2.5v5H2v2.5z" />
    </g>
    <defs>
      <clipPath id="boat_svg__a">
        <path fill="#fff" d="M2 .75h20v22.5H2z" />
      </clipPath>
    </defs>
  </svg>
);
export default BoatIcon;
