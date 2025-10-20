import * as React from 'react';
import type { SVGProps } from 'react';
const MusicIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#music_svg__a)">
      <path d="M21.999 3.25h-15v12.5h2.5v-5h10v5h-5v5h5v-5H22zm-2.5 5h-10v-2.5h10z" />
      <path d="M6.999 15.75h-5v5h5z" />
    </g>
    <defs>
      <clipPath id="music_svg__a">
        <path fill="#fff" d="M2 3.25h20v17.5H2z" />
      </clipPath>
    </defs>
  </svg>
);
export default MusicIcon;
