import * as React from 'react';
import type { SVGProps } from 'react';
const GraphicsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#graphics_svg__a)">
      <path d="M20.75 18.25H3.25v2.5h17.5zM13.25 3.25h-2.5v12.5h2.5zM18.25 5.75h-2.5v10h2.5zM8.25 10.75h-2.5v5h2.5z" />
    </g>
    <defs>
      <clipPath id="graphics_svg__a">
        <path fill="#fff" d="M3.25 3.25h17.5v17.5H3.25z" />
      </clipPath>
    </defs>
  </svg>
);
export default GraphicsIcon;
