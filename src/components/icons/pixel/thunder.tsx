import * as React from 'react';
import { SVGProps } from 'react';

const ThunderIcon = (props: SVGProps<SVGSVGElement>) => {
  const id = React.useId();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <g fill="currentColor" clipPath={`url(#${id})`}>
        <path d="M16.086 3h-2.629v2.629h2.629v-2.63Z" />
        <path d="M18.713 10.885h-5.257V5.628h-2.628v2.629H8.199v2.628H5.57v2.629h5.258v5.257H8.199V21.4h2.629V18.77h2.628v-2.628h2.629v-2.63h2.628v-2.628Z" />
      </g>
      <defs>
        <clipPath id={id}>
          <path fill="#fff" d="M5.571 3h13.143v18.4H5.571z" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ThunderIcon;
