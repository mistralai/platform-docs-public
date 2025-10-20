import * as React from 'react';
import type { SVGProps } from 'react';
const CalendarIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g clipPath="url(#calendar_svg__a)">
      <path
        fill="currentColor"
        d="M20.75 5.75h-2.5v-2.5h-2.5v2.5h-7.5v-2.5h-2.5v2.5H3.249v15H20.75zm-12.5 12.5h-2.5v-2.5h2.5zm0-5h-2.5v-2.5h2.5zm5 5h-2.5v-2.5h2.5zm0-5h-2.5v-2.5h2.5zm5 5h-2.5v-2.5h2.5zm0-5h-2.5v-2.5h2.5z"
      />
    </g>
    <defs>
      <clipPath id="calendar_svg__a">
        <path fill="#fff" d="M3.25 3.25h17.5v17.5H3.25z" />
      </clipPath>
    </defs>
  </svg>
);
export default CalendarIcon;
