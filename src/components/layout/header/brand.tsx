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
import MistralLogoSolid from '@/components/icons/assets/mistral-logo-solid';

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
    _logoUrl.pathname = '/brand/m-solid.svg';
    return _logoUrl;
  }, []);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div>{children}</div>
      </ContextMenuTrigger>
      <ContextMenuContent className="z-110">
        <BrandContextMenuItem icon={<MistralLogoSolid className="size-5" />} onClick={handleCopy}>
          Copy Logo as SVG
        </BrandContextMenuItem>
        <BrandContextMenuItem
          icon={<Download />}
          onClick={() => {
            const a = document.createElement('a');
            a.href = logoUrl.toString();
            a.download = '';
            a.click();
          }}
        >
          Download Logo as SVG
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
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
    <path fill="currentColor" d="M15.724 15.662h5.454v5.454h5.455v-5.454h5.457v-5.455h5.455v5.455h-.001v10.91h-.003l.004.001v5.455l-.006.002h5.46v5.455H26.636V32.03h5.455v-5.458h-5.455v5.456h-5.456v-5.455l.006-.001h-5.461v5.458h5.455v5.455H4.813V32.03h5.462l-.006-.002v-5.455l.005-.001h-.006v-10.91h.001v-5.455h5.455v5.455Z"/>
  </svg>
`;
