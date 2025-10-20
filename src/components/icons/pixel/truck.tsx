import * as React from 'react';
import type { SVGProps } from 'react';
const TruckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g clipPath="url(#truck_svg__a)">
      <path
        fill="currentColor"
        d="M3.25 17v2.5h5V17h7.5v2.5h5V17h2.5V9.5h-2.5V7h-5V4.5h-15V17zm12.5-7.5h5v5h-5zM13.25 7v7.5h-10V7z"
      />
    </g>
    <defs>
      <clipPath id="truck_svg__a">
        <path fill="#fff" d="M.75 4.5h22.5v15H.75z" />
      </clipPath>
    </defs>
  </svg>
);
export default TruckIcon;
