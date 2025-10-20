import * as React from 'react';
import type { SVGProps } from 'react';
const PickaxeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#pickaxe_svg__a)">
      <path d="M4.5 17H2v2.5h2.5zM7 19.5H4.5V22H7zM7 14.5H4.5V17H7zM9.5 17H7v2.5h2.5zM9.5 12H7v2.5h2.5zM12 14.5H9.5V17H12zM12 9.5H9.5V12H12zM9.5 7H7v2.5h2.5zM14.5 4.5H12V7h2.5zM17 7h-2.5v2.5H17zM19.5 9.5H17V12h2.5zM7 4.5H4.5V7H7zM12 2H7v2.5h5zM14.5 12H12v2.5h2.5zM17 14.5h-2.5V17H17zM19.5 17H17v2.5h2.5zM22 12h-2.5v5H22z" />
    </g>
    <defs>
      <clipPath id="pickaxe_svg__a">
        <path fill="#fff" d="M2 2h20v20H2z" />
      </clipPath>
    </defs>
  </svg>
);
export default PickaxeIcon;
