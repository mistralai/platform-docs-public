import * as React from 'react';
import type { SVGProps } from 'react';
const MotoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#moto_svg__a)">
      <path d="M7.227 16.773H3.409v1.909h3.818zM11.045 14.864h1.91v-1.91h1.909v3.819h1.91l-.001-1.91h1.909v-1.908h1.909v3.818H22.5v-3.819h-1.91v-1.909h-3.817V9.137h1.909v-1.91h-1.91V5.318h-3.818v1.91h1.91v1.909h-1.91v1.908h-1.908V9.137H7.226v1.908h1.91v1.91h1.908z" />
      <path d="M7.227 7.228H3.409v1.909h3.818zM3.409 12.955h1.908v1.909h1.91v1.909h1.909v-3.818h-1.91v-1.91H3.41zh-1.91v3.818h1.91zM20.59 16.773h-3.817v1.909h3.818z" />
    </g>
    <defs>
      <clipPath id="moto_svg__a">
        <path fill="#fff" d="M1.5 5.318h21v13.364h-21z" />
      </clipPath>
    </defs>
  </svg>
);
export default MotoIcon;
