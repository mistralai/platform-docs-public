import { cn } from '@/lib/utils';

const proseHeadingsClassNames =
  'prose-headings:first:mt-0 prose-h1:mt-[1.6em] prose-h1:mb-[0.6em] prose-h2:mt-[1.4em] prose-h2:mb-[0.5em] prose-h3:mt-[1.15em] prose-h3:mb-[0.4em] prose-h4:mt-[1em] prose-h4:mb-[0.35em] prose-h5:mt-[0.9em] prose-h5:mb-[0.3em] prose-h6:mt-[0.75em] prose-h6:mb-[0.25em]';

const proseDivisorClassNames = 'prose-hr:border-secondary-foreground';

const proseDetailsClassNames =
  '[&_details]:text-foreground [&_details>summary_+_*]:mt-6 [&_details_summary]:cursor-default';

const proseCodeClassNames = 'prose-code:text-[0.875em] prose-code:font-mono';

// Section tab spacing is handled in globals.css

const proseClassNames = [
  'prose prose-neutral text-secondary-foreground max-w-none',
  // blockquote
  'prose-blockquote:border-secondary-foreground prose-blockquote:text-secondary-foreground',
  proseHeadingsClassNames,
  proseDivisorClassNames,
  proseDetailsClassNames,
  proseCodeClassNames,
];

export const Prose = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <article
      className={cn(proseClassNames, className)}
      {...props}
      suppressHydrationWarning
    >
      {children}
    </article>
  );
};
