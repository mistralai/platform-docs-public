import * as React from 'react';
import type { SVGProps } from 'react';
const CarIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g clipPath="url(#car_svg__a)">
      <path
        fill="currentColor"
        d="M20.75 10.75h-2.5v-2.5h-2.5v-2.5h-2.5v2.5h2.5v2.5h-5v-5h2.5v-2.5h-7.5v2.5h-2.5v5H.75v7.5h2.5v2.5h5v-2.5h5v2.5h5v-2.5h5v-5h-2.5zm-12.5 0h-2.5v-5h2.5z"
      />
    </g>
    <defs>
      <clipPath id="car_svg__a">
        <path fill="#fff" d="M.75 3.25h22.5v17.5H.75z" />
      </clipPath>
    </defs>
  </svg>
);
export default CarIcon;
