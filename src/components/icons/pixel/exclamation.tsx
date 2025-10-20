import * as React from 'react';
import type { SVGProps } from 'react';
const ExclamationIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#exclamation_svg__a)">
      <path d="M13.25 18.25h-2.5v2.5h2.5zM13.25 3.25h-2.5v12.5h2.5z" />
    </g>
    <defs>
      <clipPath id="exclamation_svg__a">
        <path fill="#fff" d="M10.75 3.25h2.5v17.5h-2.5z" />
      </clipPath>
    </defs>
  </svg>
);
export default ExclamationIcon;
