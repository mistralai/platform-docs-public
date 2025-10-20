import * as React from 'react';
import type { SVGProps } from 'react';
const BatteryIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#battery_svg__a)">
      <path d="M9.499 9.5h-2.5v5h2.5zM14.5 9.5H12v5h2.5z" />
      <path d="M17 17h5V7h-5v2.5h2.5v5H17zH4.5V7H17V4.5H2v15h15z" />
    </g>
    <defs>
      <clipPath id="battery_svg__a">
        <path fill="#fff" d="M2 4.5h20v15H2z" />
      </clipPath>
    </defs>
  </svg>
);
export default BatteryIcon;
