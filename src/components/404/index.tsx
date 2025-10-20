import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function NotFoundCat({
  title = '¿Meow? Page not found.',
  description = 'The page you’re looking for was either moved or doesn’t exist.',
  className,
  children,
}: {
  title?: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'text-center flex flex-col items-center justify-center gap-10',
        className
      )}
    >
      <Image
        src="/assets/sprites/cat_sleeping.gif"
        alt="Not Found"
        className="relative -mt-4 ml-6"
        width={180}
        height={146}
      />
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
          {title}
        </h1>
        <p className="text-base sm:text-lg text-foreground/70">{description}</p>
      </div>
      {children}
    </div>
  );
}
