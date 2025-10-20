import * as React from 'react';
import type { SVGProps } from 'react';
const SunIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#sun_svg__a)">
      <path d="M5.75 3.25h-2.5v2.5h2.5zM8.25 5.75h-2.5v2.5h2.5zM15.75 8.25h-7.5v7.5h-2.5v2.5h-2.5v2.5h2.5v-2.5h2.5v-2.5h7.5zM18.25 5.75h2.5v-2.5h-2.5zh-2.5v2.5h2.5zM13.249.751h-2.5v5h2.5z" />
      <path d="M13.249 18.25h-2.5v5h2.5zM20.75 18.25h-2.5v2.5h2.5zM18.25 15.75h-2.5v2.5h2.5zM23.249 10.75h-5v2.5h5zM5.75 10.75h-5v2.5h5z" />
    </g>
    <defs>
      <clipPath id="sun_svg__a">
        <path fill="#fff" d="M.75.75h22.5v22.5H.75z" />
      </clipPath>
    </defs>
  </svg>
);
export default SunIcon;
