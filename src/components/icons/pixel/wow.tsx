import * as React from 'react';
import type { SVGProps } from 'react';
const WowIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#wow_svg__a)">
      <path d="M7 4.5H4.5V7H7zM9.5 14.5H7v5h2.5zM17 14.5h-2.5v5H17zM4.5 2H2v2.5h2.5zM9.5 2H7v2.5h2.5zM14.5 12h-5v2.5h5zM14.5 19.5h-5V22h5zM4.5 7H2v2.5h2.5zM9.5 7H7v2.5h2.5zM19.5 4.5H17V7h2.5zM17 2h-2.5v2.5H17zM22 2h-2.5v2.5H22zM17 7h-2.5v2.5H17zM22 7h-2.5v2.5H22z" />
    </g>
    <defs>
      <clipPath id="wow_svg__a">
        <path fill="#fff" d="M2 2h20v20H2z" />
      </clipPath>
    </defs>
  </svg>
);
export default WowIcon;
