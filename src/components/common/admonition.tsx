// components/mdx/Admonition.tsx
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  LightbulbIcon,
  NotebookIcon,
} from 'lucide-react';
import InfoHint from '../icons/info-hint';
import { Prose } from './prose';

type AdmonitionProps = {
  type?: 'info' | 'note' | 'tip' | 'caution' | 'warning' | 'danger' | 'success';
  title?: string;
  collapsible?: boolean | string;
  open?: boolean | string;
  children: React.ReactNode;
};

const admonitionVariants = cva(
  'my-4 rounded-lg px-6 py-4 pl-4 border-l-4 max-w-full min-w-0',
  {
    variants: {
      type: {
        info: 'border-model-blue bg-model-blue/10 dark:bg-model-blue/5 text-foreground',
        note: 'border-border bg-secondary text-secondary-foreground',
        tip: 'border-model-green bg-model-green/10 dark:bg-model-green/5 text-foreground',
        caution:
          'border-model-orange bg-model-orange/10 dark:bg-model-orange/5 text-foreground',
        warning:
          'border-model-yellow bg-model-yellow/10 dark:bg-model-yellow/5 text-foreground',
        danger: 'border-destructive bg-destructive/10 text-foreground',
        success:
          'border-model-green bg-model-green/10 dark:bg-model-green/5 text-foreground',
      },
    },
    defaultVariants: {
      type: 'note',
    },
  }
);

export function Admonition({
  type = 'note',
  title,
  collapsible,
  open,
  children,
}: AdmonitionProps) {
  const base = cn(admonitionVariants({ type }));

  const isCollapsible = String(collapsible) === 'true' || collapsible === true;
  const isOpen = String(open) === 'true' || open === true;

  if (isCollapsible) {
    return (
      <details className={base} {...(isOpen ? { open: true } : {})}>
        {title && (
          <summary className="font-semibold cursor-pointer">{title}</summary>
        )}
        <div className={title ? 'mt-2' : undefined}>{children}</div>
      </details>
    );
  }

  return (
    <div className={base}>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2">
          <AdminitionIcon type={type} />
          <span className="text-sm font-bold uppercase text-foreground/70">
            <AdminitionTypeText type={type} />
          </span>
        </div>
        {title && <div className="font-semibold mb-1">{title}</div>}
      </div>
      <Prose className="**:last:!mb-0">{children}</Prose>
    </div>
  );
}

const AdminitionTypeText = ({
  type,
}: {
  type: 'info' | 'note' | 'tip' | 'caution' | 'warning' | 'danger' | 'success';
}) => {
  switch (type) {
    case 'info':
      return 'Information';
    default:
      return type;
  }
};

const AdminitionIcon = ({
  type,
}: {
  type: 'info' | 'note' | 'tip' | 'caution' | 'warning' | 'danger' | 'success';
}) => {
  switch (type) {
    case 'info':
      return <InfoHint />;
    case 'note':
      return <NotebookIcon className="size-4" />;
    case 'tip':
      return <LightbulbIcon className="size-4" />;
    case 'caution':
      return <AlertTriangleIcon className="size-4" />;
    case 'warning':
      return <AlertCircleIcon className="size-4" />;
    case 'danger':
      return <AlertCircleIcon className="size-4" />;
    case 'success':
      return <CheckCircleIcon className="size-4" />;
  }
};

export default Admonition;
