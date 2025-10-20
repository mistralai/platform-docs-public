import * as React from 'react';
import { SVGProps } from 'react';
const MagnifyingGlass = (props: SVGProps<SVGSVGElement>) => (
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
      d="M19.111 19.111h-1.888v-1.888h1.888v1.888ZM17.223 17.223h-1.89v-1.889h1.889v1.889ZM13.444 7.776H9.667v1.891h1.889v1.889h1.888v-.557V11 7.776h1.889l.001 5.668H13.44l.004.002v1.889H9.667v-.002H7.778v-1.89.001h-1.89v-1.888l.011-.002h-.01V7.776h1.888l.001-1.887 5.666-.001v1.888Z"
    />
  </svg>
);
export default MagnifyingGlass;
