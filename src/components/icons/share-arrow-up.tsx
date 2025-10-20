import * as React from 'react';
import { SVGProps } from 'react';

export const ShareArrowUp = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={14}
    viewBox="0 0 14 14"
    fill="none"
    {...props}
  >
    <g
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth={1.167}
      opacity={0.5}
    >
      <path d="m4.668 3.5 2.333-2.333L9.335 3.5M7 1.75v5.833M4.085 5.833H2.918v5.834h8.167V5.833H9.918" />
    </g>
  </svg>
);
export default ShareArrowUp;
