import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { PixelGrid } from '../common/pixel-grid';

const avatarVariants = cva(
  'relative overflow-clip flex items-center justify-center rounded bg-model shadow-inner-ring',
  {
    variants: {
      size: {
        xs: 'size-8', // 32x32px container
        default: 'size-12', // 48x48px container
        lg: 'size-16', // 64x64px container (current model card size)
        xl: 'size-14', // 56x56px container (current model card size)
        '2xl': 'size-20', // 80x80px container
        '3xl': 'size-24', // 96x96px container
        '4xl': 'size-32', // 128x128px container
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface ModelAvatarProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof avatarVariants> {
  src: string;
  alt: string;
  href?: string;
  pixelEffect?: boolean;
}

export function ModelAvatar({
  src,
  alt,
  href,
  size = 'default',
  pixelEffect = false,
  className,
  style,
  ...props
}: ModelAvatarProps) {
  // Get the image size based on the avatar size
  const imageSize = size || 'default';

  // Convert size to actual pixel values for Next.js Image component * 2 for retina displays
  const sizeToPixels = {
    xs: 16,
    sm: 24,
    default: 32,
    lg: 40,
    xl: 48,
    '2xl': 64,
    '3xl': 80,
    '4xl': 96,
  };

  const pixelSize = sizeToPixels[imageSize];

  const avatarComp = (
    <div
      className={cn(avatarVariants({ size }), className)}
      style={style}
      {...props}
    >
      {pixelEffect && (
        <PixelGrid forceVisible speed={3} opacity={0.2} pixelSize={8} />
      )}
      <Image
        src={src}
        alt={alt}
        className="z-2 size-[60%]"
        width={pixelSize}
        height={pixelSize}
      />
    </div>
  );

  if (href) {
    return <Link href={href}>{avatarComp}</Link>;
  }

  return avatarComp;
}
