import { cva } from 'class-variance-authority';

export const $multiCodeBlockWrapper = cva(
  'w-full [&_pre]:my-0 [&_[data-type="code"]]:my-0 group/multi-codeblock'
);
export const $multiCodeBlockContent = cva(
  'flex flex-col gap-0 [&_pre]:!rounded-tl-none bg-code-background [&_p]:text-background/70 dark:[&_p]:text-foreground/70 rounded-lg rounded-tl-none',
  {
    variants: {
      outputTab: {
        true: '[&_pre]:!rounded-tr-none rounded-tr-none',
      },
    },
  }
);
