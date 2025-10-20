'use client';

import {
  tabsListVariants,
  TabsTrigger,
  tabsTriggerVariants,
} from '@/components/ui/tabs';
import {
  OperationResponseBodySectionProps,
  SectionContentProps,
  ResponseTabProps,
  useChildren,
} from '@speakeasy-api/docs-md-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

export const ResponseTabbedSection = ({
  children,
  slot,
}: OperationResponseBodySectionProps) => {
  const tabs = useChildren<ResponseTabProps>(children, 'tab');
  const contents = useChildren<SectionContentProps>(children, 'content');

  const [selectedTab, setSelectedTab] = React.useState(tabs[0]?.props?.id);
  return (
    <div className="flex flex-col gap-0">
      <div
        className={tabsListVariants({
          variant: 'tertiary',
          className: '!border-b !border-border',
        })}
      >
        {tabs.map(tab => (
          <div
            data-state={selectedTab === tab.props?.id ? 'active' : 'inactive'}
            className={cn(
              tabsTriggerVariants({
                variant: 'tertiary',
                size: 'sm',
                className: cn(
                  tab.props.id?.includes('200') &&
                    '[&>*]:text-green-600 dark:[&>*]:!text-green-700'
                ),
              }),
              'whitespace-nowrap'
            )}
            key={tab.props?.id}
            id={tab.props?.id}
            onClick={() => setSelectedTab(tab.props?.id ?? '')}
          >
            {tab.props.children}
          </div>
        ))}
      </div>

      {React.Children.toArray(contents).map(child => {
        const content = child as React.ReactElement<SectionContentProps>;
        return (
          <div
            key={content.props?.id}
            style={{
              display: selectedTab === content.props?.id ? 'flex' : 'none',
            }}
            className={cn(
              'py-6 flex flex-col relative ',
              '[&_[data-type="code"_pre]]:max-h-[400px] [&_[data-type="code"_pre]]:overflow-y-auto scrollbar-none'
            )}
          >
            {content.props.children}
          </div>
        );
      })}
    </div>
  );
};

export const ResponseTab = ({
  children,
  slot,
  id,
  ...props
}: ResponseTabProps) => {
  return (
    <TabsTrigger value={id} variant="tertiary" {...props}>
      {children}
    </TabsTrigger>
  );
};
