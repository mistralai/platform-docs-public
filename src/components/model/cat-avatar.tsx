import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { PixelGrid } from '../common/pixel-grid';
import { MODEL_COLORS, ModelColor } from '@/lib/colors';

const catImages = [
  '/assets/sprites/avatars/orange-cat.png',
  '/assets/sprites/avatars/siamese-cat.png',
  '/assets/sprites/avatars/white-cat.png',
  '/assets/sprites/avatars/tuxedo-cat.png',
  '/assets/sprites/avatars/cat-orange-tail.png',
  '/assets/sprites/avatars/gray-cat.png',
  '/assets/sprites/avatars/black-cat.png',
];

const catBackgrounds: ModelColor[] = [
  'blue',
  'beige',
  'beige',
  'pink',
  'blue',
  'orange',
  'gray',
];

export const catAvatarVariants = cva(
  'relative overflow-clip flex items-center justify-center rounded bg-model shadow-inner-ring',
  {
    variants: {
      size: {
        xs: 'size-8',
        default: 'size-12',
        lg: 'size-16',
        xl: 'size-14',
        '2xl': 'size-20',
        '3xl': 'size-24',
        '4xl': 'size-32',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface CatAvatarProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof catAvatarVariants> {
  href?: string;
  pixelEffect?: boolean;
  catIndex?: number;
  overrideColor?: string;
  backgroundColor?: ModelColor;
}

export function CatAvatar({
  href,
  size = 'default',
  pixelEffect = false,
  className,
  style,
  catIndex,
  overrideColor,
  backgroundColor,
  ...props
}: CatAvatarProps) {
  const bgColor = catBackgrounds[catIndex || 0];
  const modelColorVar = overrideColor || MODEL_COLORS[bgColor];
  const avatarStyle = {
    '--model-color': modelColorVar,
    imageRendering: 'pixelated',
    ...style,
  } as React.CSSProperties;

  const avatarComp = (
    <div
      className={cn(catAvatarVariants({ size }), className)}
      style={avatarStyle}
      {...props}
    >
      {pixelEffect && (
        <PixelGrid forceVisible speed={3} opacity={0.2} pixelSize={8} />
      )}
      <Image
        src={catImages[catIndex || 0]}
        alt="Cat avatar"
        className="z-2 w-[140%] right-[-40%] relative"
        width={192}
        height={192}
      />
    </div>
  );

  if (href) {
    return <Link href={href}>{avatarComp}</Link>;
  }

  return avatarComp;
}
