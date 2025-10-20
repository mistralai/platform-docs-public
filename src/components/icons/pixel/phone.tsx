import * as React from 'react';
import type { SVGProps } from 'react';
const PhoneIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g clipPath="url(#phone_svg__a)">
      <path
        fill="currentColor"
        d="M15.75 5.75h-5v-2.5h-2.5v17.5h7.5zm-2.5 5h-2.5v-2.5h2.5z"
      />
    </g>
    <defs>
      <clipPath id="phone_svg__a">
        <path fill="#fff" d="M8.25 3.25h7.5v17.5h-7.5z" />
      </clipPath>
    </defs>
  </svg>
);
export default PhoneIcon;
