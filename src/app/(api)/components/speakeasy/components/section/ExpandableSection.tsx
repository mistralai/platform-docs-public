// Nextra/Next.js requires us to jump through some hoops to use client
// components in MDX files. This is because MDX files cannot import files marked
// with "use client", for some reason, but it's perfectly happy to import a
// server component (this file) that then imports a client component.

import { Children, isValidElement } from 'react';
import { ExpandableSectionContents } from '../ExpandableSectionContents';
import type { ExpandableSectionProps } from '@speakeasy-api/docs-md-react';
import { InternalError } from '../../util/internalError';
import { ConnectingCell as DefaultConnectingCell } from '../property/components/cells';

/**
 * An expandable section is the top-level container that contains all schema
 * rows. There is only ever one expandable section in a given tree (aka they do
 * not nest).
 */
export function ExpandableSection(props: ExpandableSectionProps) {
  return (
    <div className="flex flex-col">
      <ExpandableSectionContents {...props} />
    </div>
  );
}

/**
 * The properties of an expandable breakout. This is assigned to the
 * `properties` slot.
 */
export function ExpandableBreakoutProperties({
  children,
  slot,
  ConnectingCell = DefaultConnectingCell,
}: any) {
  return (
    <div
      slot={slot}
      className="[&_[slot='entry']]:border-t-0 [&_[slot='entry']]:py-0 [&_[data-slot='entry-row-container']]:pb-0"
    >
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
