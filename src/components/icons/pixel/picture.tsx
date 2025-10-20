import * as React from 'react';
import type { SVGProps } from 'react';
const PictureIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#picture_svg__a)">
      <path d="M15.731 8.246h-2.496v2.496h2.496z" />
      <path d="M3.25 20.75h17.474V3.25H3.25zM5.746 5.746h12.482v12.508l-2.497-.006v-2.499l-2.496.002v-2.497h-2.496v-2.5H8.243v2.5H5.746z" />
    </g>
    <defs>
      <clipPath id="picture_svg__a">
        <path fill="#fff" d="M3.25 3.25h17.5v17.5H3.25z" />
      </clipPath>
    </defs>
  </svg>
);
export default PictureIcon;
