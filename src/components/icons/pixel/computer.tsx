import * as React from 'react';
import type { SVGProps } from 'react';
const ComputerIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g clipPath="url(#computer_svg__a)">
      <path
        fill="currentColor"
        d="M3.25 15.75h7.5v2.5h-7.5v2.5h17.5v-2.5h-7.5v-2.5h7.5V3.25H3.25zm2.5-10h12.5v7.5H5.75z"
      />
    </g>
    <defs>
      <clipPath id="computer_svg__a">
        <path fill="#fff" d="M3.25 3.25h17.5v17.5H3.25z" />
      </clipPath>
    </defs>
  </svg>
);
export default ComputerIcon;
