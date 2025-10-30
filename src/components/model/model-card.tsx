import * as React from 'react';

import { cn } from '@/lib/utils';
import { getModelUrl, Model } from '@/schema/models';
import { MODEL_COLORS, getModelColorFallback } from '@/lib/colors';
import { AVATAR_ICONS, getModelIconFallback } from '@/lib/icons';
import { ModelAvatar } from './avatar';
import { PixelGrid } from '@/components/common/pixel-grid';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '../ui/badge';

export interface ModelCardProps extends React.ComponentProps<'a'> {
  model: Model;
  showParameters?: boolean;
  variant?: 'card' | 'compact' | 'mini';
  pixelEffect?: boolean;
  overrideColor?: string;
}

export function ModelCard({
  model,
  variant = 'compact',
  pixelEffect = true,
  className,
  showParameters,
  overrideColor,
  ...props
}: ModelCardProps) {
  const isLegacy = model.status === 'Deprecated' || model.status === 'Retired';

  // Get color and icon from avatar or fallback based on model name
  const modelIcon = model.avatar?.icon || getModelIconFallback(model.name);

  const modelColorVar =
    overrideColor ||
    MODEL_COLORS[
      isLegacy
        ? 'gray'
        : model.avatar?.backgroundColor || getModelColorFallback(model.name)
    ];

  // Get the icon path
  const iconPath = AVATAR_ICONS[modelIcon];

  // Create style object to set the CSS custom properties
  const cardStyle = {
    '--model-color': modelColorVar,
  } as React.CSSProperties;

  const modelUrl = getModelUrl(model);

  if (!modelUrl) return null;

  if (variant === 'card') {
    return (
      <Link
        href={modelUrl}
        className={cn(
          'relative group flex flex-col justify-between gap-4 bg-model rounded px-4 py-3 lg:aspect-[1.5] overflow-hidden',
          'ring ring-model ring-offset-4 ring-offset-background',
          className
        )}
        style={cardStyle}
        {...props}
      >
        {pixelEffect && <PixelGrid pixelSize={8} opacity={0.35} />}

        <div className="size-16 relative z-10 max-lg:mb-14">
          <Image
            src={iconPath}
            alt={`${model.name} icon`}
            width={64}
            height={64}
            className="size-full"
          />
        </div>
        {showParameters && (
          <div className="text-xs text-foreground relative z-10">
            {model.version}
          </div>
        )}
        <div className="flex flex-col gap-0.5 relative z-10">
          <h3 className="font-bold text-xl text-foreground flex items-center gap-2">
            <span>{model.name}</span>
          </h3>
          <p className="text-sm text-foreground/50 group-hover:text-foreground/70 line-clamp-1 text-ellipsis overflow-hidden">
            {model.shortDescription || model.description}
          </p>
        </div>
      </Link>
    );
  }

  if (variant === 'mini') {
    return (
      <Link
        href={modelUrl}
        className={cn(
          'overflow-clip relative flex items-center border border-border rounded-md p-1',
          className
        )}
        style={cardStyle}
        {...props}
      >
        {pixelEffect && (
          <PixelGrid
            opacity={0.1}
            className="mix-blend-multiply"
            pixelSize={12}
            speed={2.0}
            randomness={0.3}
          />
        )}

        <ModelAvatar
          src={iconPath}
          alt={`${model.name} icon`}
          className="z-2"
          size="lg"
          style={cardStyle}
        />
        <div className="flex-1 flex flex-col min-w-0 px-2">
          <h3 className="font-bold 2xl:text-lg text-foreground line-clamp-1 text-ellipsis overflow-hidden">
            {model.name}
          </h3>
          <span className="text-xs text-foreground font-mono">
            v{model.version}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={modelUrl}
      className={cn(
        'overflow-clip relative flex items-center border border-border rounded-md p-1',
        className
      )}
      style={cardStyle}
      {...props}
    >
      {pixelEffect && (
        <PixelGrid
          opacity={0.1}
          className="mix-blend-multiply dark:mix-blend-screen"
          pixelSize={12}
          speed={2.0}
          randomness={0.3}
        />
      )}

      <ModelAvatar
        src={iconPath}
        alt={`${model.name} icon`}
        className="z-2"
        size="lg"
        style={cardStyle}
      />
      <div className="z-2 px-4 py-2 flex-1 flex flex-col">
        <h3 className="font-bold text-lg text-foreground min-w-0 w-full">
          {model.name}
        </h3>
        <div className="flex gap-2 justify-between items-baseline">
          <p className="text-sm text-foreground/70 line-clamp-1 text-ellipsis overflow-hidden">
            {model.shortDescription || model.description}
          </p>
          {showParameters && (
            <div className="text-xs text-foreground/80 font-mono font-bold">
              v{model.version}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
