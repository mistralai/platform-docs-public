import * as React from 'react';
import { SVGProps } from 'react';
const DownloadIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#a)">
      <path d="M5.75 18.25h12.5v-2.5h2.5v5H3.25v-5h2.5v2.5ZM13.25 15.75h-2.5v-2.5h2.5v2.5ZM10.75 13.25h-2.5v-2.5h2.5v2.5ZM18.25 10.75h-2.501l.001 2.5h-2.5v-2.5h2.499l.001-2.5h2.5v2.5ZM8.25 10.75h-2.5v-2.5h2.5v2.5ZM13.25 3.25v7.5h-2.5v-7.5h2.5Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M3.25 3.25h17.5v17.5H3.25z" />
      </clipPath>
    </defs>
  </svg>
);
export default DownloadIcon;
