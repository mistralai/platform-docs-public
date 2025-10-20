import * as React from 'react';
import type { SVGProps } from 'react';
const MenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#menu_svg__a)">
      <path d="M19.5 5.75h-15v2.5h15zM19.5 10.75h-15v2.5h15zM19.5 15.75h-15v2.5h15z" />
    </g>
    <defs>
      <clipPath id="menu_svg__a">
        <path fill="#fff" d="M4.5 5.75h15v12.5h-15z" />
      </clipPath>
    </defs>
  </svg>
);
export default MenuIcon;
