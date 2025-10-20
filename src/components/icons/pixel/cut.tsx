import * as React from 'react';
import type { SVGProps } from 'react';
const CutIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#cut_svg__a)">
      <path d="M20.75 3.25h-2.5v2.5h2.5zM15.75 8.25h2.5v-2.5h-2.5zM13.25 10.75h-2.5v-5h-2.5v2.5h-2.5v2.5h2.5v2.5h-2.5v2.5h2.5v2.5h2.5v-5h2.5zh2.5v-2.5h-2.5z" />
      <path d="M3.25 5.75v2.5h2.5v-2.5h2.5v-2.5h-2.5v2.5zM15.75 13.25h-2.5v2.5h2.5zM18.25 15.75h-2.5v2.5h2.5zM20.75 18.25h-2.5v2.5h2.5zM8.25 18.25h-2.5v2.5h2.5zM5.75 15.75h-2.5v2.5h2.5z" />
    </g>
    <defs>
      <clipPath id="cut_svg__a">
        <path fill="#fff" d="M3.25 3.25h17.5v17.5H3.25z" />
      </clipPath>
    </defs>
  </svg>
);
export default CutIcon;
