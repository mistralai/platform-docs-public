import { cn } from "@/lib/utils";

export const ModelCard = ({ children, className, isLegacy }: { children: React.ReactNode, className?: string, isLegacy?: boolean }) => {
  return (
    <div className={cn('rounded-md border', isLegacy ? 'grayscale' : '', className)}>
      {children}
    </div>
  );
}

export const ModelCardInner = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn('flex p-5 gap-8', className)}>
      {children}
    </div>
  );
}