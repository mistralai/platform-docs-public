import * as React from 'react';
import type { SVGProps } from 'react';
const CocktailIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g clipPath="url(#cocktail_svg__a)">
      <path
        fill="currentColor"
        d="M15.75 3.25h2.5V.75h-2.5zh-2.5v2.5h2.5v2.5h2.5v2.5h-7.5v-2.5h2.5v-2.5h-2.5v2.5h-2.5v2.5h-2.5v-2.5h2.5v-2.5h-5v5h2.5v2.5h2.5v2.5h2.5v5h-5v2.5h12.5v-2.5h-5v-5h2.5v-2.5h2.5v-2.5h2.5v-5h-5z"
      />
    </g>
    <defs>
      <clipPath id="cocktail_svg__a">
        <path fill="#fff" d="M3.25.75h17.5v22.5H3.25z" />
      </clipPath>
    </defs>
  </svg>
);
export default CocktailIcon;
