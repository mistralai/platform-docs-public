import * as React from 'react';
import type { SVGProps } from 'react';
const CometIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#Comet_svg__a)">
      <path d="M9.5 14.5H12v5h2.5V12H12V9.5H4.5V12h5z" />
      <path d="M9.5 17H7v2.5H4.5V22H12v-2.5H9.5zM17 7h-2.5v2.5H17zM9.5 4.5H7V7h2.5zM14.5 2H12v2.5h2.5zM19.5 14.5H17V17h2.5zM22 9.5h-2.5V12H22zM19.5 4.5H17V7h2.5z" />
      <path d="M4.5 17H7v-2.5H4.5V12H2v7.5h2.5z" />
    </g>
    <defs>
      <clipPath id="Comet_svg__a">
        <path fill="#fff" d="M2 2h20v20H2z" />
      </clipPath>
    </defs>
  </svg>
);
export default CometIcon;
