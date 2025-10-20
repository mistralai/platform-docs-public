'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import NextImage from 'next/image';

interface ImageProps {
  url: string | [string, string];
  alt?: string;
  width?: number | string;
  centered?: boolean;
  className?: string;
}

export function Image({
  url,
  alt = '',
  width,
  centered = false,
  className,
  ...props
}: ImageProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const getImageSrc = () => {
    if (Array.isArray(url)) {
      if (!mounted) return url[0];
      return resolvedTheme === 'dark' ? url[1] : url[0];
    }
    return url;
  };

  const imageSrc = getImageSrc();
  const isDataUrl = imageSrc.startsWith('data:');

  const imageStyle: React.CSSProperties = {};

  if (width) {
    if (typeof width === 'number') {
      imageStyle.width = `${width}px`;
      imageStyle.maxWidth = '100%';
      imageStyle.height = 'auto';
    } else {
      imageStyle.width = width;
      imageStyle.maxWidth = '100%';
      imageStyle.height = 'auto';
    }
  }

  if (isDataUrl) {
    return (
      <div className={cn('my-4', centered && 'flex justify-center', className)}>
        <img
          src={imageSrc}
          alt={alt}
          style={imageStyle}
          className={cn(
            'rounded-lg border border-border',
            width && 'max-w-full h-auto'
          )}
          {...props}
        />
      </div>
    );
  }

  if (width && typeof width === 'number') {
    return (
      <div className={cn('my-4', centered && 'flex justify-center', className)}>
        <NextImage
          src={imageSrc}
          alt={alt}
          width={width}
          height={0}
          className={cn('rounded-lg border border-border h-auto max-w-full')}
          {...props}
        />
      </div>
    );
  }

  return (
    <div className={cn('my-4', centered && 'flex justify-center', className)}>
      <img
        src={imageSrc}
        alt={alt}
        style={imageStyle}
        className={cn('rounded-lg border border-border max-w-full h-auto')}
        {...props}
      />
    </div>
  );
}
