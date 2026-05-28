'use client';
import React, { Children } from 'react';
import {
  CodeSampleTabProps,
  SectionContentProps,
  useChildren,
} from '@speakeasy-api/docs-md-react';
import {
  SectionContentWrapper,
  TabbedSectionTabs,
  TabbedSectionWrapper,
} from './components';
import { tabsTriggerVariants } from '@/components/ui/tabs';
import { useSelectedLang } from '../../../operation/components/tabs/use-selected-lang';
import { cn } from '@/lib/utils';

export const CodeSampleTabbedSection = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const tabChildren = useChildren<CodeSampleTabProps>(children, 'tab');
  const contentChildren = useChildren<SectionContentProps>(children, 'content');

  const contentChildrenWithLang = Children.toArray(contentChildren).map(
    content => {
      if (React.isValidElement<SectionContentProps>(content)) {
        const tab = tabChildren.find(tab => tab.props.id === content.props.id);
        const lang = tab?.props.tags?.codeSample as string | undefined;

        // mutate the item by cloning it with additional props
        return React.cloneElement(content, {
          ...(content.props as any),
          'data-language': lang,
          lang: lang,
        });
      }
      return content;
    }
  );

  return (
    <TabbedSectionWrapper>
      <TabbedSectionTabs>{tabChildren}</TabbedSectionTabs>
      <SectionContentWrapper>{contentChildrenWithLang}</SectionContentWrapper>
    </TabbedSectionWrapper>
  );
};

export const CodeSampleTab = ({ children, ...props }: CodeSampleTabProps) => {
  const { setSelectedLanguage } = useSelectedLang();
  const lang = props.tags?.codeSample as string | undefined;
  return (
    <button
      data-slot="tabs-trigger"
      className={cn(
        'speakeasy-code-tab-trigger',
        tabsTriggerVariants({ variant: 'code', size: 'code' })
      )}
      data-language={lang}
      onClick={() => setSelectedLanguage(lang ?? '')}
    >
      {children}
    </button>
  );
};
