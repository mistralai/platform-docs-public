import * as React from 'react';
import type { SVGProps } from 'react';
const SmileIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#smile_svg__a)">
      <path d="M10.75 9.5h-2.5V12h2.5zM5.75 14.5h2.5V12h-2.5V7h-2.5v10h2.5zM8.25 4.5h-2.5V7h2.5zM15.75 2h-7.5v2.5h7.5zM18.25 4.5h-2.5V7h2.5zM18.25 17h-2.5v2.5h2.5zM15.75 19.5h-7.5V22h7.5zM8.25 17h-2.5v2.5h2.5zM15.75 12v2.5h2.5V17h2.5V7h-2.5v5zM15.75 14.5h-7.5V17h7.5zM15.75 9.5h-2.5V12h2.5z" />
    </g>
    <defs>
      <clipPath id="smile_svg__a">
        <path fill="#fff" d="M3.25 2h17.5v20H3.25z" />
      </clipPath>
    </defs>
  </svg>
);
export default SmileIcon;
