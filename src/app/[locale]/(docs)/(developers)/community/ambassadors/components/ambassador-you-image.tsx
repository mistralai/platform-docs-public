'use client';

import MistralLogoSolid from '@/components/icons/assets/mistral-logo-solid';
import { Hand } from '@/components/icons/pixel/hand';
import { useMediaQuery } from '@/hooks/use-media-query';
import { MODEL_COLORS } from '@/lib/colors';
import { cn } from '@/lib/utils';

export const AmbassadorYouImage = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return (
    <div
      style={{
        backgroundColor: `color-mix(in srgb, ${MODEL_COLORS.yellow} 50%, transparent)`,
      }}
      className="size-full flex items-center justify-center relative"
    >
      <MistralLogoSolid className={cn('size-28')} color={MODEL_COLORS.orange} />
      <Hand
        className={cn(
          'size-12 absolute top-[60%]',
          !isMobile &&
            'group-hover:-rotate-12 transition-transform duration-200'
        )}
      />
    </div>
  );
};
