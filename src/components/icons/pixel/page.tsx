import * as React from 'react';
import type { SVGProps } from 'react';

const PageIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g clipPath="url(#page_svg__a)">
      <path
        fill="currentColor"
        d="M18.25 7V4.5h-2.5V7zV9.5h-5v-5h2.5v-2.5H3.25V22h17.5V7zM5.75 19.5V4.5h5v7.5h7.5V19.5z"
      />
    </g>
    <defs>
      <clipPath id="page_svg__a">
        <path fill="#fff" d="M3.25 2h17.5v20H3.25z" />
      </clipPath>
    </defs>
  </svg>
);
export default PageIcon;
