'use client';

import type { PropsWithChildren } from 'react';
import { forwardRef, useEffect, useMemo } from 'react';
import { isRequired } from '@/app/(api)/util/hooks';
import { useUniqueChild, useChildren } from '@speakeasy-api/docs-md-react';
import { cn } from '@/lib/utils';
import { parseTypeStructure } from '@/app/(api)/util/parseTypeStructure';
import { TypeBadge } from './components/badge';

import { useHashManager } from '@/app/(api)/hooks/use-hash-manager';
import { useState } from 'react';
import {
  ExpandableCell as DefaultExpandableCell,
  NonExpandableCell as DefaultNonExpandableCell,
  ConnectingCell as DefaultConnectingCell,
} from './components/cells';
import { ExpandablePropertyProps } from '@speakeasy-api/docs-md-react';

// Extend the imported type to include the missing properties
type ExtendedExpandablePropertyProps = ExpandablePropertyProps & {
  ExpandableCell?: typeof DefaultExpandableCell;
  NonExpandableCell?: typeof DefaultNonExpandableCell;
  ConnectingCell?: typeof DefaultConnectingCell;
};
import {
  PROPERTY_PATH_SEPARATOR,
  useIsNestedProperty,
  usePropertyContext,
  usePropertyPath,
} from '@/contexts/property-context';
import * as LinkedHoverSafeArea from '@/components/ui/linked-hover-safe-area';
import { APICopyButton } from '../../copy-button';

export function PropertyContents({
  headingId,
  slot,
  children,
  typeInfo,
  typeAnnotations,
  expandByDefault,
  ExpandableCell = DefaultExpandableCell,
  NonExpandableCell = DefaultNonExpandableCell,
  ConnectingCell = DefaultConnectingCell,
}: ExtendedExpandablePropertyProps) {
  const [highlight, setHighlight] = useState(false);
  const propCtx = usePropertyContext();

  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#/, '');
      const propertyParam = new URLSearchParams(window.location.search).get(
        'property'
      );

      // Check if the current property should be expanded based on URL hash
      if (hash === propCtx?.rootPropertyId && propertyParam) {
        const propertyValues = propertyParam.split(PROPERTY_PATH_SEPARATOR);

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

  useHashManager(headingId, setIsOpen);

  useEffect(() => {
    const propertyParam = new URLSearchParams(window.location.search).get(
      'property'
    );
    const propertyValues = propertyParam?.split(PROPERTY_PATH_SEPARATOR);
    const lastPropertyValue = propertyValues?.[propertyValues.length - 1];

    if (lastPropertyValue === headingId) {
      setHighlight(true);
    }
  }, []);

  const titleChild = useUniqueChild(children, 'title');
  const descriptionChildren = useChildren(children, 'description');
  const examplesChildren = useChildren(children, 'examples');
  const defaultValueChildren = useChildren(children, 'defaultValue');
  const embedChildren = useChildren(children, 'embed');
  const breakoutsChildren = useChildren(children, 'breakouts');

  const displayStructure = useMemo(() => {
    if (!typeInfo) return undefined;
    return parseTypeStructure(typeInfo);
  }, [typeInfo]);

  const hasDescription = descriptionChildren.length > 0;
  const hasBreakoutConnection = breakoutsChildren.length > 0;
  const hasEmbedOrExamplesConnection =
    embedChildren.length > 0 || examplesChildren.length > 0;
  const hasChildrenConnection = hasBreakoutConnection ? 'connected' : 'none';

  const isNestedProperty = useIsNestedProperty();
  const isFirstLevelProperty = !isNestedProperty;

  const hasExpandableContent = useMemo(() => {
    const hasChildren =
      breakoutsChildren.length > 0 ||
      embedChildren.length > 0 ||
      examplesChildren.length > 0;

    if (isFirstLevelProperty) {
      return hasChildren;
    }

    return hasDescription || hasChildren;
  }, [
    hasDescription,
    isFirstLevelProperty,
    breakoutsChildren,
    embedChildren,
    examplesChildren,
  ]);

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

  const handleClickComplexType = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    if (isOpen) return;
    e.preventDefault();
    setIsOpen(true);
    window.history.pushState(null, '', `#${id}`);
    requestAnimationFrame(() => {
      const targetElement = document.getElementById(id);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'instant' });
      }
    });
  };

  const usePropIdPath = usePropertyPath();
  const usePropIdPathString = usePropIdPath.join(PROPERTY_PATH_SEPARATOR);
  const rootPropertyId = propCtx?.rootPropertyId || headingId;

  return (
    <LinkedHoverSafeArea.Root hoverDelayEnter={300} hoverDelayLeave={150}>
      <div
        slot={slot}
        className="flex flex-col max-w-full h-full border-t border-border border-dashed py-2 group-last/connecting-cell:pb-0 group-first/connecting-cell:border-t-0 group/entry"
      >
        <div
          data-slot="entry-row-container"
          className={cn('rounded-md min-w-0 max-w-full', {
            'has-[&_[slot="breakout-entry"]]:bg-muted max-lg:overflow-x-auto':
              isFirstLevelProperty,
          })}
          ref={propCtx?.rowContainerRef}
        >
          <div
            className={cn('w-full min-w-fit', {
              'pl-2 pr-4': isFirstLevelProperty,
            })}
          >
            <LinkedHoverSafeArea.Trigger asChild>
              <div
                data-slot="entry-row"
                className={cn('min-w-[250px]', {
                  'property-highlight-animation': highlight,
                  'bg-background border border-border border-solid rounded-md mt-2 px-2 py-0':
                    isNestedProperty,
                })}
              >
                <div
                  className={cn(
                    'grid items-start py-2 gap-2 w-full',
                    hasDescription && isFirstLevelProperty
                      ? 'grid-cols-[auto_minmax(0px,_1fr)] md:grid-cols-[auto_minmax(0px,_1fr)_50%]'
                      : 'grid-cols-[auto_minmax(0,_1fr)]'
                  )}
                >
                  {hasExpandableContent ? (
                    <ExpandableCell
                      isOpen={isOpen}
                      setIsOpen={setIsOpen}
                      variant="property"
                    />
                  ) : (
                    <NonExpandableCell />
                  )}

                  <div className="flex-1 self-stretch flex flex-col gap-2">
                    <TitleContainer>
                      <TitlePrefixContainer>{titleChild}</TitlePrefixContainer>
                      {isRequired(typeAnnotations) && <RequiredMark />}

                      {displayStructure && (
                        <TypeBadge
                          size="sm"
                          onClickType={handleClickComplexType}
                          displayStructure={displayStructure}
                        />
                      )}
                      <CopyButtonComponent
                        headingId={rootPropertyId}
                        pathToProperty={usePropIdPathString}
                      />
                    </TitleContainer>

                    {defaultValueChildren}

                    {isOpen && isNestedProperty && hasDescription ? (
                      <div className="pb-1">{descriptionChildren}</div>
                    ) : null}
                  </div>

                  {hasDescription && isFirstLevelProperty ? (
                    <div className={cn('md:pl-4 col-[2] md:col-[3] pt-2 pb-2')}>
                      {descriptionChildren}
                    </div>
                  ) : null}

                  {isOpen && hasEmbedOrExamplesConnection && (
                    <div className="row-[3] col-[2/-1]">
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
                  )}
                </div>
              </div>
            </LinkedHoverSafeArea.Trigger>

            {hasBreakoutConnection && isOpen ? (
              <div
                data-slot="breakouts-container"
                className={cn("min-w-fit w-full", { "pb-4": isFirstLevelProperty })}
              >
                {breakoutsChildren}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </LinkedHoverSafeArea.Root>
  );
}

const CopyButtonComponent = ({
  headingId,
  pathToProperty,
}: {
  headingId: string;
  pathToProperty: string;
}) => {
  const { isHovered } = LinkedHoverSafeArea.useLinkedHoverSafeArea();

  const handleCopy = async () => {
    const url = `${window.location.origin}${window.location.pathname}?property=${pathToProperty}#${headingId}`;
    await navigator.clipboard.writeText(url);
  };

  return (
    <LinkedHoverSafeArea.Target asChild>
      <APICopyButton
        handleCopy={handleCopy}
        className="p-2 hidden lg:block lg:absolute lg:-left-1.5 lg:-translate-x-full after:absolute after:h-full after:w-1.5 after:-right-1.5"
        buttonClassName={cn({
          'opacity-0': !isHovered,
          'opacity-100': isHovered,
        })}
      />
    </LinkedHoverSafeArea.Target>
  );
};

const RequiredMark = () => {
  return (
    <span className="text-model-red font-bold font-mono align-middle">*</span>
  );
};

export const TitleContainer = forwardRef<HTMLDivElement, PropsWithChildren>(
  function TitleContainer({ children }, ref) {
    return (
      <div ref={ref} className="flex items-center gap-2 flex-wrap min-h-9">
        {children}
      </div>
    );
  }
);

const TitlePrefixContainer = forwardRef<HTMLSpanElement, PropsWithChildren>(
  function TitlePrefixContainer({ children }, ref) {
    return (
      <span ref={ref} className="inline-flex items-center w-fit gap-2">
        {children}
      </span>
    );
  }
);
