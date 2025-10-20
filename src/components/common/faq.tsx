import React from 'react';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { AccordionMultipleProps } from '@radix-ui/react-accordion';

/**
 * FAQ components for MDX
 * -----------------------------------
 * Usage in an .mdx file:
 *
 * import { Faq, FaqItem } from "@/components/mdx/faq";
 *
 * # Image API — FAQ
 *
 * <Faq type="multiple" className="my-6">
 *   <FaqItem question="What is the price per image?">
 *     No, our license terms are standardized to ensure efficient processing for all customers.
 *     If your monthly volume exceeds 1,000,000 requests or you require customized license terms,
 *     please contact our sales team.
 *   </FaqItem>
 *
 *   <FaqItem question="How many tokens correspond to an image and/or what is the maximum resolution?">
 *     Depending on the model and resolution, an image will be tokenized differently. Below is a summary.
 *   </FaqItem>
 *
 *   <FaqItem question="What's the rate limit?">
 *     Rate limits vary per account tier. Reach out to support for the current values.
 *   </FaqItem>
 * </Faq>
 *
 * Props
 * - <Faq type>: "single" (one open at a time) | "multiple" (many open). Default: "single".
 * - <Faq className>: optional tailwind classes.
 * - <FaqItem question>: string shown as the accordion header.
 * - <FaqItem children>: MDX/Markdown content; tables, code blocks, etc. are supported.
 */

export type FaqProps = AccordionMultipleProps & {
  /** Visual style preset */
  variant?: 'default' | 'bordered';
};

export function Faq({
  className,
  variant = 'default',
  type,
  children,
  defaultValue,
  ...rest
}: FaqProps) {
  return (
    <Accordion
      type="multiple"
      className={cn('w-full not-prose', className)}
      {...rest}
    >
      {children}
    </Accordion>
  );
}

export type FaqItemProps = {
  /** Question shown in the trigger */
  question: string;
  /** Optional id for deep-linking (#question-id). If omitted, a slug will be generated. */
  id?: string;
  /** Start expanded */
  defaultOpen?: boolean;
  /** Optional: render inside a Card for a filled/raised look */
  card?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function FaqItem({
  question,
  id,

  className,
  children,
}: FaqItemProps) {
  const value = (id ?? slugify(question)) || question;

  return (
    <AccordionItem value={value} className={cn('group border-none', className)}>
      <AccordionTrigger
        id={value}
        className={cn(
          'flex w-full items-center justify-between gap-4 rounded-none',
          'w-full py-2 text-left',
          'hover:no-underline',
          '[&[data-state=open]>div_svg]:rotate-180',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
        )}
      >
        <div className="flex min-w-0 flex-col text-base font text-foreground">
          <span className="font-bold leading-tight">{question}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-2 pb-3 border-t border-foreground/20">
        <div
          className={cn(
            'prose prose-neutral max-w-none dark:prose-invert',
            // Tables in answers
            'prose-table:my-3 prose-th:text-left prose-td:align-top',
            // Spacing to echo the reference screenshot
            'prose-p:leading-relaxed'
          )}
        >
          {children}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

// --- helpers ---------------------------------------------------------------
function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/** Optional: pre-expanded item support via MDX
 * In MDX you can control which items load opened by the Accordion
 * by setting defaultValue(s) on <Faq>. Example:
 *
 * <Faq type="multiple" defaultValue={["how-many-tokens", "price-per-image"]}>
 *   ...
 * </Faq>
 */
