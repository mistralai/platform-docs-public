import * as React from 'react';
import type { SVGProps } from 'react';
const TrashIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g clipPath="url(#trash_svg__a)">
      <path
        fill="currentColor"
        d="M3.25 8.25h2.5v12.5h12.5V8.25h2.5v-2.5h-2.5v-2.5H5.75v2.5h-2.5zm12.5 0v10h-2.5v-10zm-5 0v10h-2.5v-10z"
      />
    </g>
    <defs>
      <clipPath id="trash_svg__a">
        <path fill="#fff" d="M3.25 3.25h17.5v17.5H3.25z" />
      </clipPath>
    </defs>
  </svg>
);
export default TrashIcon;
