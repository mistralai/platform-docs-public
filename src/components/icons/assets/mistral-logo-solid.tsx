import * as React from 'react';
import { SVGProps } from 'react';

interface MistralLogoSolidProps extends SVGProps<SVGSVGElement> {
  color?: string;
}

const MistralLogoSolid = ({
  color,
  style,
  ...props
}: MistralLogoSolidProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={48}
    height={48}
    viewBox="0 0 48 48"
    fill="none"
    style={{ color, ...style }}
    {...props}
  >
    <path
      fill="currentColor"
      d="M15.724 15.662h5.454v5.454h5.455v-5.454h5.457v-5.455h5.455v5.455h-.001v10.91h-.003l.004.001v5.455l-.006.002h5.46v5.455H26.636V32.03h5.455v-5.458h-5.455v5.456h-5.456v-5.455l.006-.001h-5.461v5.458h5.455v5.455H4.813V32.03h5.462l-.006-.002v-5.455l.005-.001h-.006v-10.91h.001v-5.455h5.455v5.455Z"
    />
  </svg>
);

export default MistralLogoSolid;
