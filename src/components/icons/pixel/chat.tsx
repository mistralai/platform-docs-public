import * as React from 'react';
import { SVGProps } from 'react';
const ChatIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path fill="currentColor" d="M12 9.75h4.5V7.5h-9V12H12V9.75Z" />
    <path
      fill="currentColor"
      d="M5.25 18.75H7.5V16.5H5.25V5.25h13.499v9H7.499v2.25H21V3h-18v18h2.25v-2.25Z"
    />
  </svg>
);
export default ChatIcon;
