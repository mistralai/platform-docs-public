import * as React from 'react';
import type { SVGProps } from 'react';
const BeerIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#beer_svg__a)">
      <path d="M14.5 19.5h-10V22h10zM9.5 2H7v2.5h2.5zM9.5 7H7v2.5h2.5zM12 4.5H9.5V7H12zM19.5 7H17V2h-5v2.5h2.5V7H12v2.5h2.5l-.001 10h2.5V17H19.5v-2.5H17v-5h2.5v5H22v-5h-2.5zM4.5 7H7V4.5H4.5V2H2v17.5h2.5z" />
    </g>
    <defs>
      <clipPath id="beer_svg__a">
        <path fill="#fff" d="M2 2h20v20H2z" />
      </clipPath>
    </defs>
  </svg>
);
export default BeerIcon;
