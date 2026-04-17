'use client';

import { PixelGrid } from '@/components/common/pixel-grid';
import { ArrowRightUpIcon } from '@/components/icons/pixel/arrow-right-up';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export interface AmbassadorCardProps {
  name: string;
  image: string | React.ReactNode;
  link: string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const AmbassadorCard = ({
  name,
  image,
  link,
  className,
  color = 'primary-soft',
  style,
}: AmbassadorCardProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const isYou = name.toLowerCase() === 'you';
  return (
    <Link
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        style
          ? `relative p-2 rounded-sm flex flex-col gap-2 overflow-hidden cursor-pointer group transition-transform duration-200 ${
              !isMobile ? 'hover:scale-[1.01]' : ''
            }`
          : `relative p-2 ${
              color === 'secondary' ? 'bg-secondary/70' : `bg-${color}`
            } rounded-sm flex flex-col gap-2 overflow-hidden cursor-pointer group transition-transform duration-200 ${
              !isMobile ? `hover:scale-[1.01]` : ''
            }`,
        className
      )}
      style={style}
    >
      <PixelGrid pixelSize={8} opacity={0.35} className="absolute inset-0" />
      <div
        className={
          style
            ? 'w-full h-36 overflow-hidden rounded relative flex items-center justify-center'
            : `w-full h-36 overflow-hidden rounded relative bg-${color} flex items-center justify-center`
        }
        style={style ? { backgroundColor: style.backgroundColor } : undefined}
      >
        {typeof image === 'string' ? (
          <Image
            src={image}
            alt={name}
            width={300}
            height={300}
            className={`size-full object-cover grayscale mix-blend-multiply dark:mix-blend-hard-light`}
          />
        ) : (
          image
        )}
      </div>
      <div
        className={cn(
          'flex items-center justify-between pr-1 relative z-10',
          isYou && 'justify-center'
        )}
      >
        <h4>
          {name}
          {isYou && '?'}
        </h4>
        {!isYou && (
          <ArrowRightUpIcon
            className={cn(
              'size-5',
              !isMobile &&
                'group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200'
            )}
          />
        )}
      </div>
    </Link>
  );
};
