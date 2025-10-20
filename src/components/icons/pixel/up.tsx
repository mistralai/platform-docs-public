import * as React from 'react';
import type { SVGProps } from 'react';
const UpIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#up_svg__a)">
      <path d="M13.25 2h-2.5v2.5h2.5zM13.25 7h-2.5v15h2.5zM10.75 4.5h-2.5V7h2.5zM15.75 4.5h-2.5V7h2.5zM18.25 7h-2.5v2.5h2.5zM8.25 7h-2.5v2.5h2.5z" />
    </g>
    <defs>
      <clipPath id="up_svg__a">
        <path fill="#fff" d="M5.75 2h12.5v20H5.75z" />
      </clipPath>
    </defs>
  </svg>
);
export default UpIcon;
