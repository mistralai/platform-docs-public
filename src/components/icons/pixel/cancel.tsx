import * as React from 'react';
import type { SVGProps } from 'react';
const CancelIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#cancel_svg__a)">
      <path d="M13.75 10.25h-3.5v3.5h3.5zM10.25 13.75h-3.5v3.5h3.5zM6.75 17.25h-3.5v3.5h3.5zM17.25 6.75h-3.5v3.5h3.5zM20.75 3.25h-3.5v3.5h3.5zM10.25 6.75h-3.5v3.5h3.5zM6.749 3.25h-3.5v3.5h3.5zM20.75 17.25h-3.5v3.5h3.5zM17.25 13.75h-3.5v3.5h3.5z" />
    </g>
    <defs>
      <clipPath id="cancel_svg__a">
        <path fill="#fff" d="M3.25 3.25h17.5v17.5H3.25z" />
      </clipPath>
    </defs>
  </svg>
);
export default CancelIcon;
