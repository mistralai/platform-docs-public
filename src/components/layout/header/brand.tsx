'use client';

import React, { useMemo } from 'react';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { BASE_URL, MISTRAL_BRAND_GUIDELINES_URL, MISTRAL_URL } from '@/lib/constants';
import { useCopyButton } from '@/components/ui/copy-button';
import { Slottable } from '@radix-ui/react-slot';

const BrandContextMenuItem = ({
  children,
  icon,
  ...props
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
} & React.ComponentProps<typeof ContextMenuItem>) => {
  return (
    <ContextMenuItem className="flex items-center h-10 gap-2" {...props}>
      <span className="inline-flex justify-center items-center size-5">
        {icon}
      </span>
      <Slottable>{children}</Slottable>
    </ContextMenuItem>
  );
};

export const BrandContextMenu = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { handleCopy } = useCopyButton({
    value: copyLogo.trim(),
    preventDefault: false,
    stopPropagation: false,
  });

  const logoUrl = useMemo(() => {
    const _logoUrl = new URL(BASE_URL);
    _logoUrl.pathname = '/brand/m-rainbow.svg';
    return _logoUrl;
  }, []);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div>{children}</div>
      </ContextMenuTrigger>
      <ContextMenuContent className="z-110">
        <BrandContextMenuItem icon={<MistralIso />} onClick={handleCopy}>
          Copy Logo as SVG
        </BrandContextMenuItem>
        <BrandContextMenuItem asChild icon={<Download />}>
          <a
            href={logoUrl.toString()}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            Download Logo as SVG
          </a>
        </BrandContextMenuItem>
        <BrandContextMenuItem
          icon={<Pen />}
          onClick={() => {
            window.location.href = MISTRAL_BRAND_GUIDELINES_URL.toString();
          }}
        >
          Brand Guidelines
        </BrandContextMenuItem>
        <BrandContextMenuItem
          icon={<Home />}
          onClick={() => {
            window.location.href = MISTRAL_URL.toString();
          }}
        >
          Go to Homepage
        </BrandContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

const MistralIso = () => (
  <svg
    className="size-5"
    viewBox="0 0 365 258"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M104.107 0H52.0525V51.57H104.107V0Z" fill="#FFD800"></path>
    <path d="M312.351 0H260.296V51.57H312.351V0Z" fill="#FFD800"></path>
    <path
      d="M156.161 51.5701H52.0525V103.14H156.161V51.5701Z"
      fill="#FFAF00"
    ></path>
    <path
      d="M312.353 51.5701H208.244V103.14H312.353V51.5701Z"
      fill="#FFAF00"
    ></path>
    <path
      d="M312.356 103.14H52.0525V154.71H312.356V103.14Z"
      fill="#FF8205"
    ></path>
    <path
      d="M104.107 154.71H52.0525V206.28H104.107V154.71Z"
      fill="#FA500F"
    ></path>
    <path
      d="M208.228 154.711H156.174V206.281H208.228V154.711Z"
      fill="#FA500F"
    ></path>
    <path
      d="M312.351 154.711H260.296V206.281H312.351V154.711Z"
      fill="#FA500F"
    ></path>
    <path d="M156.195 206.312H0V257.882H156.195V206.312Z" fill="#E10500"></path>
    <path
      d="M364.439 206.312H208.244V257.882H364.439V206.312Z"
      fill="#E10500"
    ></path>
  </svg>
);

const Download = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.74976 12.4998L10.2498 12.4998L10.2498 9.99976L7.74976 9.99976L7.74976 12.4998Z"
      fill="currentColor"
    ></path>
    <path
      d="M10.2498 10L12.7498 10L12.7495 7.5L15.2495 7.5L15.2495 5L12.7495 5L12.7495 7.5L10.2495 7.5L10.2498 10Z"
      fill="currentColor"
    ></path>
    <path
      d="M15.2495 12.4998L15.2498 14.9998H2.74976L2.74951 12.4998H0.249512L0.249762 17.5L0.250012 17.4998H17.75L17.7495 12.4998H15.2495Z"
      fill="currentColor"
    ></path>
    <path
      d="M5.24976 10L7.74976 10L7.74976 7.5L5.24976 7.5L5.24976 10Z"
      fill="currentColor"
    ></path>
    <path
      d="M2.74976 7.5L5.24976 7.5L5.24976 5L2.74976 5L2.74976 7.5Z"
      fill="currentColor"
    ></path>
    <path
      d="M7.74976 7.5L10.2498 7.5L10.2498 0L7.74976 -2.18557e-07L7.74976 7.5Z"
      fill="currentColor"
    ></path>
  </svg>
);

const Pen = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.9998 4.99975H17.4998V2.49975H14.9998V0H12.4995V2.49975H14.9995V4.99975H17.4995V7.49975H19.9998V4.99975Z"
      fill="currentColor"
    ></path>
    <path
      d="M17.4998 7.5H14.9998V5H12.4998V2.5H9.99951V4.99975H7.49951V7.49975H4.99951V9.99975H2.49951V12.4998H4.99951V9.99975H7.49951V7.49975H9.99951V5H12.4995V7.5H14.9995V9.99975H12.4995V12.4998H9.99951V14.9998H7.49951V12.4998H4.99951V14.9998H7.49951V17.4998H9.99951V14.9998H12.4995V12.4998H14.9995V10H17.4998V7.5Z"
      fill="currentColor"
    ></path>
    <path
      d="M-0.000244141 12.4998V19.9998H7.49976V17.4998H2.49976V12.4998H-0.000244141Z"
      fill="currentColor"
    ></path>
  </svg>
);

const Home = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.2495 0.25H7.74951V2.75H10.2495V0.25Z"
      fill="currentColor"
    ></path>
    <path
      d="M15.2495 17.75V10.2498H12.7495V15.25H10.2495V10.25H7.74951V15.25H5.24951V10.2498H2.74951V17.75H15.2495Z"
      fill="currentColor"
    ></path>
    <path
      d="M7.74951 2.74976H5.24951V5.24976H7.74951V2.74976Z"
      fill="currentColor"
    ></path>
    <path
      d="M12.7495 2.74976H10.2495V5.24976H12.7495V2.74976Z"
      fill="currentColor"
    ></path>
    <path
      d="M5.24951 5.24976H2.74951V7.74976H5.24951V5.24976Z"
      fill="currentColor"
    ></path>
    <path
      d="M15.2495 5.24976H12.7495V7.74976H15.2495V5.24976Z"
      fill="currentColor"
    ></path>
    <path
      d="M2.74951 7.74976H0.249512V10.2498H2.74951V7.74976Z"
      fill="currentColor"
    ></path>
    <path
      d="M17.7495 7.74976H15.2495V10.2498H17.7495V7.74976Z"
      fill="currentColor"
    ></path>
  </svg>
);

const copyLogo = `
  <svg width="365" height="258" viewBox="0 0 365 258" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="Mistral AI Logo">
      <path d="M104.107 0H52.0525V51.57H104.107V0Z" fill="#FFD800"/>
      <path d="M312.351 0H260.296V51.57H312.351V0Z" fill="#FFD800"/>
      <path d="M156.161 51.5701H52.0525V103.14H156.161V51.5701Z" fill="#FFAF00"/>
      <path d="M312.353 51.5701H208.244V103.14H312.353V51.5701Z" fill="#FFAF00"/>
      <path d="M312.356 103.14H52.0525V154.71H312.356V103.14Z" fill="#FF8205"/>
      <path d="M104.107 154.71H52.0525V206.28H104.107V154.71Z" fill="#FA500F"/>
      <path d="M208.228 154.711H156.174V206.281H208.228V154.711Z" fill="#FA500F"/>
      <path d="M312.351 154.711H260.296V206.281H312.351V154.711Z" fill="#FA500F"/>
      <path d="M156.195 206.312H0V257.882H156.195V206.312Z" fill="#E10500"/>
      <path d="M364.439 206.312H208.244V257.882H364.439V206.312Z" fill="#E10500"/>
    </g>
  </svg>
`;
