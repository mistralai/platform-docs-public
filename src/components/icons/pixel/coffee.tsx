import * as React from 'react';
import type { SVGProps } from 'react';
const CoffeeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#coffee_svg__a)">
      <path d="M13.25 19.5h-7.5V22h7.5zM10.75 4.5h-2.5V7h2.5zM15.75 4.5h-2.5V7h2.5zM20.75 12h-2.5v2.5h2.5zM8.25 2h-2.5v2.5h2.5zM13.25 2h-2.5v2.5h2.5zM5.75 12h7.5v7.5h2.5V17h2.5v-2.5h-2.5V12h2.5V9.5h-5V7h-2.5v2.5h-2.5V7h-2.5v2.5h-2.5v10h2.5z" />
    </g>
    <defs>
      <clipPath id="coffee_svg__a">
        <path fill="#fff" d="M3.25 2h17.5v20H3.25z" />
      </clipPath>
    </defs>
  </svg>
);
export default CoffeeIcon;
