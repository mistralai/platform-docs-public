import * as React from 'react';
import type { SVGProps } from 'react';
const AddIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M10.75 15.75h2.5v-2.5h2.5v-2.5h-2.5v-2.5h-2.5v2.5h-2.5v2.5h2.5z"
    />
    <path
      fill="currentColor"
      d="M20.75 3.25H3.25v17.5h17.5zm-2.5 15H5.75V5.75h12.5z"
    />
  </svg>
);
export default AddIcon;
