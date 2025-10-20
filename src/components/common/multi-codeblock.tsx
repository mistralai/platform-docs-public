'use client';

import React from 'react';
import {
  Tabs as UITabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import DashedRightArrow from './dashed-right-arrow';
import { useTabSync, isCodingLanguage } from '@/contexts/tab-sync-context';
import './multi-codeblock.css';
import {
  $multiCodeBlockWrapper,
  $multiCodeBlockContent,
} from './multi-codeblock.styles';
interface CodeSnippetProps {
  value: string;
  label: string;
}

interface TabsProps {
  children: React.ReactNode;
  className?: string;
  tabsClassName?: string;
}

const OUTPUT_TAB_VALUE = 'output';

function Tabs({ children, className, tabsClassName }: TabsProps) {
  const { selectedLanguage, setSelectedLanguage } = useTabSync();

  const snippets = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<CodeSnippetProps> =>
      React.isValidElement(child) &&
      typeof (child.props as CodeSnippetProps).value === 'string'
  );

  if (snippets.length === 0) {
    return null;
  }

  const notOutputTabs = snippets.filter(
    snippet => snippet.props.value !== OUTPUT_TAB_VALUE
  );

  const outputTab = snippets.find(
    snippet => snippet.props.value === OUTPUT_TAB_VALUE
  );

  const availableLanguages = notOutputTabs.map(tab =>
    tab.props.value.toLowerCase()
  );

  const getActiveTab = () => {
    if (availableLanguages.includes(selectedLanguage)) {
      return selectedLanguage;
    }
    return notOutputTabs[0]?.props?.value || 'code';
  };

  const [activeTab, setActiveTab] = React.useState<string>(getActiveTab());

  React.useEffect(() => {
    const newActiveTab = getActiveTab();
    if (newActiveTab !== activeTab) {
      setActiveTab(newActiveTab);
    }
  }, [selectedLanguage, availableLanguages.join(',')]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (isCodingLanguage(value)) {
      setSelectedLanguage(value);
    }
  };

  return (
    <div data-type="multi-codeblock" className={$multiCodeBlockWrapper()}>
      <UITabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full flex flex-col gap-0"
      >
        <TabsList className="flex w-full" variant="code">
          {notOutputTabs.map(snippet => (
            <TabsTrigger
              data-type="multi-codeblock-tab"
              key={snippet.props.value}
              value={snippet.props.value}
              className={cn(
                'text-sm data-[state=active]:bg-code-background data-[state=active]:text-foreground',
                tabsClassName
              )}
              variant="code"
              size="sm"
            >
              {snippet.props.label || snippet.props.value}
            </TabsTrigger>
          ))}
          {outputTab && (
            <>
              <div className="flex-1 flex items-center">
                <DashedRightArrow
                  className="text-foreground px-2"
                  lineThickness={1}
                  arrowSize={8}
                />
                <TabsTrigger
                  data-type="multi-codeblock-tab"
                  value={'output'}
                  className="text-sm flex-1 text-center"
                  variant="code"
                  size="sm"
                >
                  Output
                </TabsTrigger>
              </div>
            </>
          )}
        </TabsList>
        <div
          className={$multiCodeBlockContent({
            outputTab: outputTab ? true : false,
          })}
          data-type="multi-codeblock-content"
        >
          {children}
        </div>
      </UITabs>
    </div>
  );
}

interface TabItemProps {
  value: string;
  label?: string;
  className?: string;
}

const TabItem = ({
  value,
  children,
}: Omit<CodeSnippetProps, 'label'> & {
  children: React.ReactNode;

  label?: string | React.ReactNode;
}) => {
  return (
    <TabsContent
      data-language={value}
      value={value}
      className={cn(
        "!p-0 overflow-hidden [&>[data-type='code']]:!mt-0 [&>[data-type='code']]:!mb-0"
      )}
    >
      {children}
    </TabsContent>
  );
};

export { Tabs, TabItem };
