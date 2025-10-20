import * as React from 'react';
import type { SVGProps } from 'react';
const PointIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#point_svg__a)">
      <path d="M7 13.25H4.5v2.5H7zM19.5 10.75H12v-7.5H9.5v12.5H7v2.5h2.5v2.5H17v-2.5h2.5z" />
    </g>
    <defs>
      <clipPath id="point_svg__a">
        <path fill="#fff" d="M4.5 3.25h15v17.5h-15z" />
      </clipPath>
    </defs>
  </svg>
);
export default PointIcon;
