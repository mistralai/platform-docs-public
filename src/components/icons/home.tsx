import * as React from 'react';
const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 14 15"
    fill="none"
    {...props}
  >
    <g clipPath="url(#a)" opacity={0.5}>
      <mask
        id="b"
        width={14}
        height={15}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: 'luminance',
        }}
      >
        <path fill="#fff" d="M0 .5v14h14V.5H0Z" />
      </mask>
      <g mask="url(#b)">
        <path
          fill="currentColor"
          d="M10.5 7.5h2.333V5.167h-2.334V7.5ZM8.165 5.167h2.333V2.833H8.166v2.334ZM5.833 2.833h2.333V.5H5.833v2.333ZM3.499 5.167h2.334V2.833H3.499v2.334ZM1.166 7.5h2.333V5.167H1.166V7.5Zm4.667 0h2.333V5.167H5.833V7.5Zm0 2.333h2.333V7.5H5.833v2.333Zm0 2.334h2.333V9.833H5.833v2.334Zm0 2.333h2.333v-2.333H5.833V14.5Z"
        />
      </g>
      <path fill="currentColor" d="M2 6.5h10v8H2z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 .5h14v14H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default HomeIcon;
