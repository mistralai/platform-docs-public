import * as React from 'react';
import type { SVGProps } from 'react';
const QuestionIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#question_svg__a)">
      <path d="M13.5 19.5h-3v3h3zM10.5 1.5v3h-3v3h3v-3h2.999v9h-3v3h3v-3h3v-9h-3v-3z" />
    </g>
    <defs>
      <clipPath id="question_svg__a">
        <path fill="#fff" d="M7.5 1.5h9v21h-9z" />
      </clipPath>
    </defs>
  </svg>
);
export default QuestionIcon;
