import { PixelGrid } from '@/components/common/pixel-grid';
import { cn } from '@/lib/utils';

interface StatRatingProps {
  rating: { stars: number };
  maxStars?: number;
  isLegacy?: boolean;
}

export function StatRating({
  rating,
  maxStars = 4,
  isLegacy = false,
}: StatRatingProps) {
  const filledStars = rating.stars;
  const unfilledStars = maxStars - rating.stars;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-1 relative">
        {Array.from({ length: filledStars }, (_, i) => {
          const starValue = i + 1;
          const isFilled = rating.stars >= starValue;
          const isHalfFilled =
            rating.stars >= starValue - 0.5 && rating.stars < starValue;

          return (
            <Star key={i} isFilled={isFilled} isHalfFilled={isHalfFilled} />
          );
        })}
        {!isLegacy && <PixelGrid pixelSize={3} className="absolute inset-0" />}
      </div>
      <div className="flex items-center gap-1">
        {Array.from({ length: unfilledStars }, (_, i) => {
          return <Star key={i} isFilled={false} isHalfFilled={false} />;
        })}
      </div>
    </div>
  );
}

const Star = ({
  isFilled,
  isHalfFilled,
}: {
  isFilled: boolean;
  isHalfFilled: boolean;
}) => {
  return (
    <div
      className={cn(
        'relative w-4 h-6 rounded ring shadow-sm',
        'bg-primary-soft ring-primary-soft/20 shadow-primary-soft/10',
        isFilled ? 'opacity-100' : isHalfFilled ? 'opacity-50' : 'opacity-30'
      )}
    />
  );
};
