import * as React from 'react';
import type { SVGProps } from 'react';
const CopyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#copy_svg__a)">
      <path d="M4.5 3.25H12v2.5h2.5v-5H2v15h5v-2.5H4.5z" />
      <path d="M9.5 23.249H22v-15H9.5zm2.5-12.5h7.5v10H12z" />
    </g>
    <defs>
      <clipPath id="copy_svg__a">
        <path fill="#fff" d="M2 .75h20v22.5H2z" />
      </clipPath>
    </defs>
  </svg>
);
export default CopyIcon;
