import * as React from 'react';
import type { SVGProps } from 'react';
const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#search_svg__a)">
      <path d="M8.25 5.75h-2.5v2.5h2.5zM15.75 5.75h-2.5v2.5h2.5zM13.25 3.25h-5v2.5h5zM15.75 13.25h-2.5v2.5h2.5zM18.25 15.75h-2.5v2.5h2.5zM20.75 18.25h-2.5v2.5h2.5zM8.25 13.25h-2.5v2.5h2.5zM13.25 15.75h-5v2.5h5zM5.75 8.25h-2.5v5h2.5zM18.25 8.25h-2.5v5h2.5z" />
    </g>
    <defs>
      <clipPath id="search_svg__a">
        <path fill="#fff" d="M3.25 3.25h17.5v17.5H3.25z" />
      </clipPath>
    </defs>
  </svg>
);
export default SearchIcon;
