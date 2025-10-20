import * as React from 'react';
import type { SVGProps } from 'react';
const TurnRightIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#turn-right_svg__a)">
      <path d="M18.25 9.5h-2.5V12h-2.5v2.5h2.5V12h2.5zh2.5V7h-2.5zM8.25 17h-2.5v2.5h2.5zM5.75 12h-2.5v5h2.5z" />
      <path d="M15.75 7h-7.5v2.5h-2.5V12h2.5V9.5h7.5zM18.25 19.5h-10V22h10zM18.25 4.5h-2.5V7h2.5zM15.75 2h-2.5v2.5h2.5z" />
    </g>
    <defs>
      <clipPath id="turn-right_svg__a">
        <path fill="#fff" d="M3.25 2h17.5v20H3.25z" />
      </clipPath>
    </defs>
  </svg>
);
export default TurnRightIcon;
