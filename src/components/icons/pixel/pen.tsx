import * as React from 'react';
import type { SVGProps } from 'react';
const PenIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#pen_svg__a)">
      <path d="M22 7h-2.5V4.5H17V2h-2.5v2.5H17V7h2.5v2.5H22z" />
      <path d="M19.5 9.5H17V7h-2.5V4.5H12V7H9.5v2.5H7V12H4.5v2.5H7V12h2.5V9.5H12V7h2.5v2.5H17V12h-2.5v2.5H12V17H9.5v-2.5H7V17h2.5v2.5H12V17h2.5v-2.5H17V12h2.5z" />
      <path d="M2 14.5V22h7.5v-2.5h-5v-5z" />
    </g>
    <defs>
      <clipPath id="pen_svg__a">
        <path fill="#fff" d="M2 2h20v20H2z" />
      </clipPath>
    </defs>
  </svg>
);
export default PenIcon;
