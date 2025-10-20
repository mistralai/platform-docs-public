'use client';

import { useEffect, useMemo, useState } from 'react';
import { useChildren, useUniqueChild } from '@speakeasy-api/docs-md-react';
// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { ConnectingCell as DefaultConnectingCell } from '../cells/ConnectingCell';
// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { ExpandableCell as DefaultExpandableCell } from '../cells/ExpandableCell';
// eslint-disable-next-line fast-import/no-restricted-imports -- Confirmed we're using the component as a default only
import { NonExpandableCell as DefaultNonExpandableCell } from '../cells/NonExpandableCell';
import { useHashManager } from '@/app/(api)/hooks/use-hash-manager';
import { TitleContainer } from '../../content';
import { Badge } from '@/components/ui/badge';
import {
  PROPERTY_PATH_SEPARATOR,
  useIsNestedProperty,
  usePropertyContext,
} from '@/contexts/property-context';
import { cn } from '@/lib/utils';

export function BreakoutContents({
  headingId,
  slot,
  hasExpandableContent,
  expandByDefault,
  children,
  ExpandableCell = DefaultExpandableCell,
  NonExpandableCell = DefaultNonExpandableCell,
  ConnectingCell = DefaultConnectingCell,
}: any) {
  const propCtx = usePropertyContext();

  const titleChild = useUniqueChild(children, 'title');
  const descriptionChildren = useChildren(children, 'description');
  const examplesChildren = useChildren(children, 'examples');
  const defaultValueChildren = useChildren(children, 'defaultValue');
  const embedChildren = useChildren(children, 'embed');
  const propertiesChildren = useChildren(children, 'properties');
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#/, '');
      const propertyParam = new URLSearchParams(window.location.search).get(
        'property'
      );

      // Check if the current property should be expanded based on URL hash
      if (hash === propCtx?.rootPropertyId && propertyParam) {
        const propertyValues = propertyParam.split(PROPERTY_PATH_SEPARATOR);

        if (
          headingId ===
          'operation-agents_api_v1_agents_update_version_responses_200_application-json_completion_args_completionargs'
        ) {
          console.log('value', propertyValues[propCtx?.depth], {
            propertyParam,
            propertyValues,
            depth: propCtx?.depth,
          });
        }

        if (propertyValues.length > propCtx?.depth) {
          const targetPropertyValue = propertyValues[propCtx?.depth];
          if (targetPropertyValue === headingId) {
            return true;
          }
        }
      }
    }

    // Fall back to expandByDefault prop or false
    return expandByDefault ?? false;
  });
  const hasChildrenConnection =
    propertiesChildren.length > 0 ? 'connected' : 'none';
  const hasDescription = descriptionChildren.length > 0;

  useHashManager(headingId, setIsOpen);

  const rootRowContainerRef = useMemo(() => {
    if (!propCtx) return undefined;

    let currentCtx = propCtx;

    while (currentCtx.parent) {
      currentCtx = currentCtx.parent;
    }

    return currentCtx.rowContainerRef;
  }, [propCtx]);

  useEffect(() => {
    if (!isOpen) return;

    rootRowContainerRef?.current?.scrollTo({
      left: rootRowContainerRef.current.scrollWidth,
      behavior: 'smooth',
    });
  }, [isOpen, rootRowContainerRef]);

  const isNestedProperty = useIsNestedProperty();
  const isFirstLevelProperty = !isNestedProperty;

  return (
    <div
      slot={`breakout-${slot}`}
      className={cn('flex flex-col mt-2', {
        'max-lg:overflow-x-auto': isFirstLevelProperty,
      })}
      ref={propCtx?.rowContainerRef}
    >
      <div className="bg-secondary rounded-md border border-border">
        <div className="flex items-start py-2 pl-2 pr-4 gap-2 w-full">
          {hasExpandableContent ? (
            <ExpandableCell
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              variant="breakout"
            />
          ) : (
            <NonExpandableCell />
          )}
          <div className="flex-1 self-stretch flex flex-col gap-2">
            <TitleContainer>
              {titleChild}{' '}
              <Badge size="sm" variant="type-object" className="font-mono">
                {'{object}'}
              </Badge>
            </TitleContainer>
            {defaultValueChildren}
            {isOpen && hasDescription ? (
              <div className="pb-1">{descriptionChildren}</div>
            ) : null}
          </div>
        </div>

        <ConnectingCell
          bottom={hasChildrenConnection}
          top={hasChildrenConnection}
          right="none"
        >
          {examplesChildren}
        </ConnectingCell>
        <ConnectingCell
          bottom={hasChildrenConnection}
          top={hasChildrenConnection}
          right="connected"
        >
          {embedChildren}
        </ConnectingCell>
      </div>
      {isOpen && propertiesChildren}
    </div>
  );
}
