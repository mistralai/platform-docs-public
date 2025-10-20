import * as React from 'react';
import type { SVGProps } from 'react';
const FilterIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#filter_svg__a)">
      <path d="M15.75 10.75h2.5v-2.5h-2.5zh-2.5v2.5h2.5zM13.25 13.25h-2.5v7.5h2.5z" />
      <path d="M3.25 8.25h2.5v2.5h2.5v2.5h2.5v-2.5h-2.5v-2.5h-2.5v-2.5h12.5v2.5h2.5v-5H3.25z" />
    </g>
    <defs>
      <clipPath id="filter_svg__a">
        <path fill="#fff" d="M3.25 3.25h17.5v17.5H3.25z" />
      </clipPath>
    </defs>
  </svg>
);
export default FilterIcon;
