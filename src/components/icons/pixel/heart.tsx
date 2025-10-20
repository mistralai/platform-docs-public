import * as React from 'react';
import type { SVGProps } from 'react';
const HeartIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#heart_svg__a)">
      <path d="M13.25 7h-2.5v2.5h2.5zM10.75 4.5h-2.5V7h2.5zM5.75 4.5h-2.5V7h2.5zM3.25 12V7H.75v5zv2.5h2.5V12zM8.25 14.5h-2.5V17h2.5zM10.75 17h-2.5v2.5h2.5zM13.25 19.5h-2.5V22h2.5zM15.75 17h-2.5v2.5h2.5zM18.25 14.5h-2.5V17h2.5zM20.75 12h-2.5v2.5h2.5zh2.5V7h-2.5zM8.25 2h-2.5v2.5h2.5zM15.75 4.5h-2.5V7h2.5zM20.75 4.5h-2.5V7h2.5zM18.25 2h-2.5v2.5h2.5z" />
    </g>
    <defs>
      <clipPath id="heart_svg__a">
        <path fill="#fff" d="M.75 2h22.5v20H.75z" />
      </clipPath>
    </defs>
  </svg>
);
export default HeartIcon;
