import { cn } from '@/lib/utils';
import NextImage from 'next/image';

interface ImageProps {
  url: string | [string, string];
  alt?: string;
  width?: number | string;
  centered?: boolean;
  className?: string;
}

function ImageElement({
  src,
  alt,
  width,
  className,
}: {
  src: string;
  alt: string;
  width?: number | string;
  className?: string;
}) {
  const useNextImage = typeof width === 'number' && !src.startsWith('data:');
  const baseClassName = cn(
    'rounded-lg border border-border max-w-full h-auto',
    className
  );

  if (useNextImage) {
    return (
      <NextImage
        src={src}
        alt={alt}
        width={width}
        height={0}
        className={baseClassName}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      style={
        width
          ? {
              width: typeof width === 'number' ? `${width}px` : width,
              maxWidth: '100%',
              height: 'auto',
            }
          : undefined
      }
      className={baseClassName}
    />
  );
}

export function Image({
  url,
  alt = '',
  width,
  centered = false,
  className,
  ...props
}: ImageProps) {
  const hasThemeVariants = Array.isArray(url);

  if (hasThemeVariants) {
    const [lightSrc, darkSrc] = url;
    return (
      <div className={cn('my-4', centered && 'flex justify-center', className)}>
        <ImageElement
          src={lightSrc}
          alt={alt}
          width={width}
          className="dark:hidden"
          {...props}
        />
        <ImageElement
          src={darkSrc}
          alt={alt}
          width={width}
          className="hidden dark:block"
          {...props}
        />
      </div>
    );
  }

  return (
    <div className={cn('my-4', centered && 'flex justify-center', className)}>
      <ImageElement src={url} alt={alt} width={width} {...props} />
    </div>
  );
}
