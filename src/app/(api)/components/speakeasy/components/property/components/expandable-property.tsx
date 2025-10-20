'use client';

// Nextra/Next.js requires us to jump through some hoops to use client
// components in MDX files. This is because MDX files cannot import files marked
// with "use client", for some reason, but it's perfectly happy to import a
// server component (this file) that then imports a client component.

import { Children, isValidElement } from 'react';
import { InternalError } from '../../../util/internalError';
// eslint-disable-next-line fast-import/no-restricted-imports
import { ConnectingCell as DefaultConnectingCell } from '../components/cells';
import { PropertyContents } from '../content';
import type {
  ExpandablePropertyBreakoutsProps,
  ExpandablePropertyDefaultValueProps,
  ExpandablePropertyDescriptionProps,
  ExpandablePropertyExamplesProps,
  ExpandablePropertyProps,
  ExpandablePropertyTitleProps,
} from '@speakeasy-api/docs-md-react';
import { PropertyProvider } from '@/contexts/property-context';
import { Prose } from '@/components/common/prose';

/**
 * An expandable property renders a row in the UI that represents a property in
 * an object schema, aka a thing with a name, type, and annotations in the header
 * and front-matter, children, etc. in the body.
 */
export function ExpandableProperty(props: ExpandablePropertyProps) {
  return (
    <PropertyProvider
      slot={props.slot}
      headingId={props.headingId}
      propertyName={props.headingId}
      typeInfo={props.typeInfo}
      typeAnnotations={props.typeAnnotations}
    >
      <PropertyContents {...props} />
    </PropertyProvider>
  );
}

/**
 * The description of an expandable property. This is assigned to the
 * `description` slot.
 */
export function ExpandablePropertyDescription({
  children,
  slot,
}: ExpandablePropertyDescriptionProps) {
  return (
    <Prose className="prose-sm text-secondary-foreground/70" slot={slot}>
      {children}
    </Prose>
  );
}

/**
 * The default value of an expandable property. This is assigned to the
 * `defaultValue` slot.
 */
export function ExpandablePropertyDefaultValue({
  children,
  slot,
}: ExpandablePropertyDefaultValueProps) {
  return (
    <div className="text-sm pb-1" slot={slot}>
      {children}
    </div>
  );
}

/**
 * The examples of an expandable property. This is assigned to the `examples`
 * slot.
 */
export function ExpandablePropertyExamples({
  children,
  slot,
}: ExpandablePropertyExamplesProps) {
  return <Prose slot={slot} className='prose-p:my-2 [&>[data-type=code]]:mt-0'>{children}</Prose>;
}

export function ExpandablePropertyBreakouts({
  children,
  slot,
  ConnectingCell = DefaultConnectingCell,
}: ExpandablePropertyBreakoutsProps) {
  return (
    <div slot={slot} className="flex flex-col">
      {Children.map(children, (child, index) => {
        // Filter out non-React elements to match ConnectingCell's type requirements
        if (!isValidElement(child)) {
          throw new InternalError('Expected a valid React element');
        }

        // `index` is stable for this data, since the children are determined by
        // the compiler and not at runtime
        return (
          <ConnectingCell
            key={index}
            bottom={
              index === Children.count(children) - 1 ? 'none' : 'connected'
            }
            top="connected"
            right="connected"
          >
            {child}
          </ConnectingCell>
        );
      })}
    </div>
  );
}

export const ExpandablePropertyTitle = ({
  children,
  slot,
}: ExpandablePropertyTitleProps) => {
  return (
    <div className="font-semibold" slot={slot}>
      {children}
    </div>
  );
};
