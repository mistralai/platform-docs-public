import { cn } from '@/lib/utils';
import * as React from 'react';
import { SVGProps } from 'react';
export default function BackgroundGradient() {
  const className = 'absolute w-full h-full bottom-0 z-0 cursor-pointer-none';
  return (
    <>
      <LightGradient className={cn(className, 'dark:hidden')} />
      <DarkGradient className={cn(className, 'hidden dark:flex')} />
    </>
  );
}

const LightGradient = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={56}
    height={983}
    viewBox="0 0 56 983"
    preserveAspectRatio="none"
    fill="none"
    {...props}
  >
    <path fill="#F9E092" d="M0 240h1920v743H0z" />
    <g fill="#FA5111" opacity={0.4}>
      <path d="M0 384.004h1920v48H0z" opacity={0.5} />
      <path d="M0 576.006h1920v48H0z" opacity={0.1} />
      <path d="M0 336.004h1920v48H0z" opacity={0.6} />
      <path d="M0 528.006h1920v48H0z" opacity={0.2} />
      <path d="M0 288.003h1920v48H0z" opacity={0.7} />
      <path d="M0 480.005h1920v48H0z" opacity={0.3} />
      <path d="M0 240.003h1920v48H0z" opacity={0.8} />
      <path d="M0 432.005h1920v48H0z" opacity={0.4} />
    </g>
    <path fill="#FF9549" d="M1920 48H0V0h1920z" opacity={0.1} />
    <path fill="#FF9549" d="M1920 96H0V48h1920z" opacity={0.2} />
    <path fill="#FF9549" d="M1920 144.001H0v-48h1920z" opacity={0.3} />
    <path fill="#FF9549" d="M1920 192.002H0v-48h1920z" opacity={0.6} />
    <path fill="#FF9549" d="M1920 240.002H0v-48h1920z" opacity={0.8} />
  </svg>
);

const DarkGradient = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={56}
    height={983}
    viewBox="0 0 56 983"
    preserveAspectRatio="none"
    fill="none"
    {...props}
  >
    <path fill="#000" d="M0 240h56v743H0z" />
    <g fill="#303990" opacity={0.4}>
      <path d="M56 839.003H0v-48h56z" opacity={0.6} />
      <path d="M56 647H0v-48h56z" opacity={0.2} />
      <path d="M56 599H0v-48h56z" opacity={0.1} />
      <path d="M56 887.003H0v-48h56z" opacity={0.7} />
      <path d="M56 695.001H0v-48h56z" opacity={0.3} />
      <path d="M56 935.004H0v-48h56z" opacity={0.75} />
      <path d="M56 743.001H0v-48h56z" opacity={0.4} />
      <path d="M56 983.004H0v-48h56z" opacity={0.8} />
      <path d="M56 791.002H0v-48h56z" opacity={0.5} />
    </g>
    <path fill="#000" d="M56 48H0V0h56z" opacity={0.1} />
    <path fill="#000" d="m56 96-56 .001v-48h56z" opacity={0.2} />
    <path fill="#000" d="M56 144.001H0v-48h56z" opacity={0.3} />
    <path fill="#000" d="M56 192.002H0v-48h56z" opacity={0.6} />
    <path fill="#000" d="M56 240.002H0v-48h56z" opacity={0.8} />
  </svg>
);
