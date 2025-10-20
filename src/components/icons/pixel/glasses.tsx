import * as React from 'react';
import type { SVGProps } from 'react';
const GlassesIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#glasses_svg__a)">
      <path d="M19.827 8.461h-1.712v1.712h1.712zM21.538 6.75h-1.711v1.712h1.711zM23.25 8.461h-1.712v1.712h1.712zM6.134 8.461H4.423v1.712h1.711zM7.846 6.75H6.134v1.712h1.712zM9.557 8.461H7.846v1.712h1.711zM18.115 10.173h-1.712v1.711h1.712z" />
      <path d="M2.712 13.595h3.423v1.712h1.711v-1.712h1.712v1.712h1.711v1.712h3.423v-1.711H11.27v-1.713h3.423v1.712h1.712v-3.423H4.423v-1.711H2.71v1.712H1v3.423h1.711v1.711h3.423v-1.711H2.712z" />
    </g>
    <defs>
      <clipPath id="glasses_svg__a">
        <path fill="#fff" d="M1 6.75h22.25v10.269H1z" />
      </clipPath>
    </defs>
  </svg>
);
export default GlassesIcon;
