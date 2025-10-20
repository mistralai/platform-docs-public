import * as React from 'react';
import { SVGProps } from 'react';
const ArrowReversibleIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M18.14 14.829v2.825h-2.825v-2.825H3.45v-2.826H20.4v2.826h-2.26ZM3.452 10.876V8.05h3.389V5.225h2.825V8.05h10.735v2.825H3.452ZM9.667 5.224V2.4h2.825v2.825H9.667ZM15.313 20.479h-2.825v-2.825h2.825v2.825Z"
    />
  </svg>
);
export default ArrowReversibleIcon;
