import * as React from 'react';
import type { SVGProps } from 'react';
const CameraIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#camera_svg__a)">
      <path d="M22 18.25V5.75h-5v2.5h2.5v10h-5v-2.5h-5v2.5h-5v-10H7v-2.5H2v15h20zM17 3.25H7v2.5h10z" />
      <path d="M14.5 8.25h-5v2.5h5zM9.5 10.75H7v5h2.5zM17 10.75h-2.5v5H17z" />
    </g>
    <defs>
      <clipPath id="camera_svg__a">
        <path fill="#fff" d="M2 3.25h20v17.5H2z" />
      </clipPath>
    </defs>
  </svg>
);
export default CameraIcon;
