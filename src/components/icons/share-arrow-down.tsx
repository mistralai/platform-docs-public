import { SVGProps } from 'react';

export const ShareArrowDown = (props: SVGProps<SVGSVGElement>) => (
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
      <path d="m4.957 6.417 2.042 2.041L9.04 6.417M7 7.875V1.167" />
      <path d="M9.915 2.917h1.75v8.75H2.332v-8.75h1.75" />
    </g>
  </svg>
);
export default ShareArrowDown;
