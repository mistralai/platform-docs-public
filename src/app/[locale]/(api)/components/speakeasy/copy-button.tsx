import { CheckIcon } from '@/components/icons/pixel';
import { CopyButton, CopyButtonProps } from '@/components/ui/copy-button';
import { cn } from '@/lib/utils';
import { LinkIcon } from 'lucide-react';

export const APICopyButton = (props: CopyButtonProps) => {
  return (
    <CopyButton
      {...props}
      CopyIcon={({ copyState, className }) =>
        copyState === 'copied' || copyState === 'disappearing' ? (
          <CheckIcon className={cn(className, 'text-primary-soft')} />
        ) : (
          <LinkIcon className={cn(className, 'text-foreground/50')} />
        )
      }
      className={cn(
        'border border-transparent p-1 rounded focus-ring',
        props.className
      )}
      buttonClassName={cn(
        'size-4 transition-opacity duration-100',
        props.buttonClassName
      )}
    />
  );
};
