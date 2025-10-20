import { cn } from '@/lib/utils';

export default function NoSidebarPageLayout({
  children,
  className,
  noSpacing = false,
}: {
  children: React.ReactNode;
  noSpacing?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-4xl py-8',
        {
          'space-y-16': !noSpacing,
        },
        className
      )}
    >
      {children}
    </div>
  );
}
