'use client';

import { tabsListVariants, tabsTriggerVariants } from '@/components/ui/tabs';
import {
  ResponseExamplesTabbedSectionProps,
  useChildren,
  ResponseExamplesTabProps,
  SectionContentProps,
} from '@speakeasy-api/docs-md-react';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { SectionContentWrapper } from '../code-sample/components';

export const ResponseExamplesTabbedSection = ({
  children,
}: ResponseExamplesTabbedSectionProps) => {
  const tabs = useChildren<ResponseExamplesTabProps>(children, 'tab');
  const contents = useChildren<SectionContentProps>(children, 'content');

  return (
    <ReponseActiveTabProvider initialActiveTab={tabs[0]?.props?.id}>
      <div className="flex flex-col gap-0">
        <div
          className={tabsListVariants({
            variant: 'code',
            className: '!border-b !border-border',
          })}
        >
          {tabs}
        </div>
        <SectionContentWrapper>{contents}</SectionContentWrapper>
      </div>
    </ReponseActiveTabProvider>
  );
};

export const ResponseExamplesTab = ({
  children,
  slot,
  id,
  ...props
}: ResponseExamplesTabProps) => {
  const context = useReponseActiveTab();
  if (!context) throw new Error('Context not found');
  const { activeTab, setActiveTab } = context;

  return (
    <div
      data-state={activeTab === id ? 'active' : 'inactive'}
      className={cn(
        tabsTriggerVariants({
          variant: 'code',
          size: 'sm',
          className: cn(
            id?.includes('200') &&
              'data-[state=active]:text-types-enum-foreground'
          ),
        }),
        'whitespace-nowrap',
        activeTab === id && 'bg-code-background text-foreground'
      )}
      key={id}
      id={id}
      onClick={() => setActiveTab(id ?? '')}
    >
      {children}
    </div>
  );
};
type ReponseActiveTabContextType = {
  activeTab: string | undefined;
  setActiveTab: (activeTab: string | undefined) => void;
};
const ReponseActiveTabContext = React.createContext<
  ReponseActiveTabContextType | undefined
>(undefined);

export const ReponseActiveTabProvider = ({
  children,
  initialActiveTab,
}: {
  children: React.ReactNode;
  initialActiveTab: string | undefined;
}) => {
  const [activeTab, setActiveTab] = React.useState<string | undefined>(
    initialActiveTab
  );

  return (
    <ReponseActiveTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </ReponseActiveTabContext.Provider>
  );
};

export const useReponseActiveTab = () => {
  return React.useContext(ReponseActiveTabContext) as
    | ReponseActiveTabContextType
    | undefined;
};
