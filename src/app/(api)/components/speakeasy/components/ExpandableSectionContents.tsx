import { Children, isValidElement } from 'react';
import { ConnectingCell as DefaultConnectingCell } from './property/components/cells';
import type { ExpandableSectionProps } from '@speakeasy-api/docs-md-react';
import { InternalError } from '../util/internalError';
import { ExpandableTreeTopper as DefaultExpandableTreeTopper } from './section/tree-topper';

export function ExpandableSectionContents({
  children,
  ExpandableTreeTopper = DefaultExpandableTreeTopper,
  ConnectingCell = DefaultConnectingCell,
}: ExpandableSectionProps) {
  return (
    <>
      <ExpandableTreeTopper />
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
            data-index={index}
            bottom="none"
            top="none"
            right="none"
          >
            {child}
          </ConnectingCell>
        );
      })}
    </>
  );
}
