import * as React from 'react';
import type { SVGProps } from 'react';
const CalculatorIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g clipPath="url(#calculator_svg__a)">
      <path
        fill="currentColor"
        d="M20.75 3.25H3.25v17.5h17.5zm-12.5 15h-2.5v-2.5h2.5zm0-5h-2.5v-2.5h2.5zm5 5h-2.5v-2.5h2.5zm0-5h-2.5v-2.5h2.5zm5 5h-2.5v-2.5h2.5zm0-5h-2.5v-2.5h2.5zm0-5H5.75v-2.5h12.5z"
      />
    </g>
    <defs>
      <clipPath id="calculator_svg__a">
        <path fill="#fff" d="M3.25 3.25h17.5v17.5H3.25z" />
      </clipPath>
    </defs>
  </svg>
);
export default CalculatorIcon;
