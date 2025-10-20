import * as React from 'react';
import { SVGProps } from 'react';

const ArrowUpIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M16 9h2.667v2.667H16V9ZM13.333 6.334H16V9h-2.667V6.334ZM10.667 9h2.666v10.667h-2.666V9ZM10.667 3.667h2.666v2.667h-2.666V3.667ZM8 6.334h2.667V9H8V6.334ZM5.333 9H8v2.667H5.333V9Z"
    />
  </svg>
);
export default ArrowUpIcon;
