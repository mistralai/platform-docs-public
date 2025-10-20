import * as React from 'react';
import type { SVGProps } from 'react';
const UserIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#user_svg__a)">
      <path d="M14.5 2.001h-5v2.5H7v5h2.498V12h5V9.5H9.501V4.501h4.998zM17 4.5h-2.5v5H17zM7 17h10v-2.5H6.999V17h-2.5v5H7zM19.5 17H17v5h2.5z" />
    </g>
    <defs>
      <clipPath id="user_svg__a">
        <path fill="#fff" d="M4.5 2h15v20h-15z" />
      </clipPath>
    </defs>
  </svg>
);
export default UserIcon;
