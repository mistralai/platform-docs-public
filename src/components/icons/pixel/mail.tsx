import * as React from 'react';
import type { SVGProps } from 'react';
const MailIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#mail_svg__a)">
      <path d="M9.5 9.5H7V12h2.5zM14.5 12h-5v2.5h5zM17 9.5h-2.5V12H17z" />
      <path d="M22 19.5v-15H2v15zM4.5 9.5H7V7h10v2.5h2.5V17h-15z" />
    </g>
    <defs>
      <clipPath id="mail_svg__a">
        <path fill="#fff" d="M2 4.5h20v15H2z" />
      </clipPath>
    </defs>
  </svg>
);
export default MailIcon;
