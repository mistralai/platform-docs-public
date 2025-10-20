import { cva } from 'class-variance-authority';
import { DisplayTypeInfo } from '../types/shared';
import { computeSingleLineDisplayType } from '../util/displayType';
import {
  parseTypeStructure,
  ParsedTypeStructure,
} from '../util/parseTypeStructure';

type TypeBadgeVariant =
  | 'error'
  | 'warning'
  | 'info'
  | 'success'
  | 'primary'
  | 'secondary';

type TypeBadgeProps =
  | (DisplayTypeInfo & {
      variant?: TypeBadgeVariant;
      useStructuredData?: boolean;
    })
  | {
      title: string;
      variant?: TypeBadgeVariant;
    }
  | {
      structure: ParsedTypeStructure;
      variant?: TypeBadgeVariant;
    };

const typeBadgeVariants = cva(
  'text-sm border rounded-sm h-5.5 px-2 inline-flex items-center justify-center font-mono',
  {
    variants: {
      variant: {
        error: 'bg-red-400/20 border-red-500 text-red-500',
        warning: 'bg-yellow-500/20 border-yellow-500 text-yellow-500',
        info: 'bg-cyan-500 border-cyan-500 text-cyan-500',
        success: 'bg-green-400/20 border-green-500 text-green-500',
        primary: 'bg-primary/20 border-primary text-primary',
        secondary: 'bg-primary-soft/20 border-primary-soft text-primary-soft',
      },
    },
    defaultVariants: {
      variant: 'secondary',
    },
  }
);

export const TypeBadge = (props: TypeBadgeProps) => {
  const variant = props.variant || 'secondary';

  if ('title' in props) {
    if (!props.title) {
      return null;
    }
    return <div className={typeBadgeVariants({ variant })}>{props.title}</div>;
  }

  if ('structure' in props) {
    const { structure } = props;
    return (
      <div className={typeBadgeVariants({ variant })}>
        {structure.root.linkedLabel || structure.root.label}
      </div>
    );
  }

  const { breakoutSubTypes, label, children, linkedLabel, useStructuredData } =
    props;

  if (!label) {
    return null;
  }

  if (useStructuredData) {
    const structure = parseTypeStructure(props as DisplayTypeInfo);
    return (
      <div className={typeBadgeVariants({ variant })}>
        {structure.root.linkedLabel || structure.root.label}
      </div>
    );
  }

  const displayText = (() => {
    if (children && children.length > 0) {
      const { display } = computeSingleLineDisplayType(
        props as DisplayTypeInfo
      );
      return display;
    }
    return linkedLabel || label;
  })();

  return (
    <div
      className={typeBadgeVariants({ variant })}
      dangerouslySetInnerHTML={{ __html: displayText }}
    />
  );
};
