import * as React from 'react';
import type { SVGProps } from 'react';
const UploadIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#upload_svg__a)">
      <path d="M13.25 3.25h-2.5v2.5h2.5zM10.75 5.75h-2.5v2.5h-2.5v2.5h2.5v-2.5h2.5zM18.25 15.75v2.5H5.75v-2.5h-2.5v5h17.5v-5zM15.75 5.75h-2.5v2.5h2.5zM18.25 8.25h-2.5v2.5h2.5zM13.25 8.25h-2.5v7.5h2.5z" />
    </g>
    <defs>
      <clipPath id="upload_svg__a">
        <path fill="#fff" d="M3.25 3.25h17.5v17.5H3.25z" />
      </clipPath>
    </defs>
  </svg>
);
export default UploadIcon;
