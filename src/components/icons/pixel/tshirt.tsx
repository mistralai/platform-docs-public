import * as React from 'react';
import type { SVGProps } from 'react';
const TShirtIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g clipPath="url(#t-shirt_svg__a)">
      <path
        fill="currentColor"
        d="M22 2h-7.501v2.5h5V7H17v12.5H7V7H4.5V4.5h5V7h5V4.5h-5V2H2v7.5h2.5L4.5 22h15V9.5H22z"
      />
    </g>
    <defs>
      <clipPath id="t-shirt_svg__a">
        <path fill="#fff" d="M2 2h20v20H2z" />
      </clipPath>
    </defs>
  </svg>
);
export default TShirtIcon;
