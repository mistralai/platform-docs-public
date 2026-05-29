// Nextra/Next.js requires us to jump through some hoops to use client
// components in MDX files. This is because MDX files cannot import files marked
// with "use client", for some reason, but it's perfectly happy to import a
// server component (this file) that then imports a client component.

import { PropertyProvider } from '@/contexts/property-context';
import { BreakoutContents } from './components/breakout/BreakoutContents';
import type {
  ExpandableBreakoutProps,
  ExpandableBreakoutTitleProps,
  ExpandableBreakoutDescriptionProps,
  ExpandableBreakoutExamplesProps,
  ExpandableBreakoutDefaultValueProps,
} from '@speakeasy-api/docs-md-react';
import { Prose } from '@/components/common/prose';

/**
 * An expandable breakout renders a row in the UI that represents a breakout in
 * a non-object schema, aka a thing with just a name in the header and
 * front-matter, children, etc. in the body.
 *
 * Breakouts take in a series of children with slots, but the default
 * implementation just renders them directly as received. Slots exist for custom
 * implementations that may want to lay out children more specifically.
 */
export function ExpandableBreakout(props: ExpandableBreakoutProps) {
  return (
    <PropertyProvider
      slot={props.slot}
      headingId={props.headingId}
      propertyName={props.headingId}
    >
      <BreakoutContents {...props} />
    </PropertyProvider>
  );
}

/**
 * The title of an expandable breakout. This is assigned to the `title` slot.
 */
export function ExpandableBreakoutTitle({
  children,
  slot,
}: ExpandableBreakoutTitleProps) {
  return <div slot={slot}>{children}</div>;
}

/**
 * The description of an expandable breakout. This is assigned to the
 * `description` slot.
 */
export function ExpandableBreakoutDescription({
  children,
  slot,
}: ExpandableBreakoutDescriptionProps) {
  return (
    <Prose className="prose-sm text-secondary-foreground/70" slot={slot}>
      {children}
    </Prose>
  );
}

/**
 * The examples of an expandable breakout. This is assigned to the `examples`
 * slot.
 */
export function ExpandableBreakoutExamples({
  children,
  slot,
}: ExpandableBreakoutExamplesProps) {
  return <div slot={slot}>{children}</div>;
}

/**
 * The default value of an expandable breakout. This is assigned to the
 * `defaultValue` slot.
 */
export function ExpandableBreakoutDefaultValue({
  children,
  slot,
}: ExpandableBreakoutDefaultValueProps) {
  return <div slot={slot}>{children}</div>;
}
